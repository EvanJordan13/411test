package com.team48.procompare.controller;
import com.team48.procompare.model.Player;
import com.team48.procompare.model.PositionEnum;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.dao.EmptyResultDataAccessException;

@RestController
public class PlayerController {
    private final JdbcTemplate jdbcTemplate;

    RowMapper<Player> rowMapper = (result, rowNum) -> {
        Player player = new Player();
        player.setPlayerID(result.getString("playerID"));
        player.setPlayerName(result.getString("playerName"));
        player.setPlayerAge(result.getInt("playerAge"));
        player.setTeamId(result.getInt("teamID"));
        player.setTeamName(result.getString("teamName"));
        player.setScore(result.getFloat("score"));
        player.setNumSeasons(result.getInt("numSeasons"));
        player.setNumGames(result.getInt("numGames"));

        // TODO: Should this just set all stats for simplicity?
        // Set the average stats for the player based on their position.
        String position = (result.getString("position"));
        player.setPosition(position);
        List<String> statNames = PositionEnum.valueOf(position).getStats();
        Map<String, Object> stats = new HashMap<>();
        // Add "avg" to beginning of statname, this corresponds to the SQL query below.
        for(String statName : statNames) {
            stats.put("avg" + statName, result.getObject("avg" + statName));
        }
        player.setStats(stats);
        return player;
    };

    public PlayerController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Lists and sorts players given request parameters. Paginates results with pageSize 10.
     * TODO: Implement sorting and filtering.
     * TODO: Maybe put the SQL query to get all averages in stored procedure.
     *
     * @param page The page number to retrieve (default is 1) as a request parameter.
     * @return List of Player objects that match criteria.
     * @throws EmptyResultDataAccessException if no player is found. Handled by GlobalExceptionHandler.
     */
    @GetMapping("/players")
    public List<Player> listPlayers(@RequestParam(defaultValue = "1") int page) {
        int pageSize = 10;
        int offset = pageSize * (page - 1);
        // Displays all avg stats for the players, even irrelevant ones.
        // Add "avg" to stat name, e.g. avgpassYds (no capitalization).
        // These will be parsed properly in the response, see the rowMapper code.
        String sql = """
            SELECT p.playerID, p.playerName, p.playerAge, t.teamID, t.teamName, p.position, p.score, COUNT(s.year) AS numSeasons, SUM(s.games) AS numGames,
            AVG(s.passYds) AS avgpassYds, AVG(s.passTDs) AS avgpassTDs, AVG(s.ints) AS avgints, AVG(s.compPct) AS avgcompPct,
            AVG(s.rshAtt) AS avgrshAtt, AVG(s.rshYds) AS avgrshYds, AVG(s.rshTDs) AS avgrshTDs, AVG(s.rec) AS avgrec,\s
            AVG(s.recYds) AS avgrecYds, AVG(s.recTDs) AS avgrecTDs
            FROM Player p JOIN Statistics s USING(playerID) JOIN Team t USING(teamID)
            GROUP BY p.playerID
            LIMIT ? OFFSET ?
            """;
        return jdbcTemplate.query(sql, rowMapper, pageSize, offset);
    }

    /**
     * Retrieves a single player by their playerID.
     *
     * @param playerID The ID of the player to retrieve as a path variable.
     * @return The Player object if found.
     * @throws EmptyResultDataAccessException if no player is found. Handled by GlobalExceptionHandler.
     */
    @GetMapping("/players/{playerID}")
    public Player getPlayer(@PathVariable String playerID) {
        String sql = """
            SELECT p.playerID, p.playerName, p.playerAge, t.teamID, t.teamName, p.position, p.score, COUNT(s.year) AS numSeasons, SUM(s.games) AS numGames,
            AVG(s.passYds) AS avgpassYds, AVG(s.passTDs) AS avgpassTDs, AVG(s.ints) AS avgints, AVG(s.compPct) AS avgcompPct,
            AVG(s.rshAtt) AS avgrshAtt, AVG(s.rshYds) AS avgrshYds, AVG(s.rshTDs) AS avgrshTDs, AVG(s.rec) AS avgrec,\s
            AVG(s.recYds) AS avgrecYds, AVG(s.recTDs) AS avgrecTDs
            FROM Player p JOIN Statistics s USING(playerID) JOIN Team t USING(teamID)
            WHERE p.playerID = ?
            GROUP BY p.playerID
            """;
        return jdbcTemplate.queryForObject(sql, rowMapper, playerID);
    }
}
