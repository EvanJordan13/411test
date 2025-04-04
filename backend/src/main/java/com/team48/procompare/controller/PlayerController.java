package com.team48.procompare.controller;
import com.team48.procompare.model.Player;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.PathVariable;
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
        player.setPosition(result.getString("position"));
        player.setScore(result.getFloat("score"));
        return player;
    };

    public PlayerController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Lists and sorts players given request parameters.
     * TODO: Implement sorting and filtering.
     *
     * @return List of Player objects that match criteria.
     * @throws EmptyResultDataAccessException if no player is found. Handled by GlobalExceptionHandler.
     */
    @GetMapping("/players")
    public List<Player> listPlayers() {
        // TODO: Figure out pagination, remove LIMIT 5.
        String sql = """
            SELECT p.playerID, p.playerName, p.playerAge, t.teamID, t.teamName, p.position, p.score
            FROM Player p JOIN Team t USING(teamID)
            LIMIT 5
            """;
        return jdbcTemplate.query(sql, rowMapper);
    }

    /**
     * Retrieves a single player by their playerID.
     *
     * @param playerID The ID of the player to retrieve.
     * @return The Player object if found.
     * @throws EmptyResultDataAccessException if no player is found. Handled by GlobalExceptionHandler.
     */
    @GetMapping("/players/{playerID}")
    public Player getPlayer(@PathVariable String playerID) {
        String sql = """
            SELECT p.playerID, p.playerName, p.playerAge, t.teamID, t.teamName, p.position, p.score
            FROM Player p JOIN Team t USING(teamID)
            WHERE p.playerID = ?
            """;
        return jdbcTemplate.queryForObject(sql, rowMapper, playerID);
    }
}
