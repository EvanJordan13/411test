package com.team48.procompare.controller;

import com.team48.procompare.model.Team;

import java.util.List;

import com.team48.procompare.rowmapper.PlayerRowMapper;
import com.team48.procompare.rowmapper.TeamRowMapper;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.jdbc.core.JdbcTemplate;

@RestController
public class TeamController {
    private final JdbcTemplate jdbcTemplate;

    public TeamController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Lists and sorts teams given request parameters.
     *
     * @return List of Team objects that match criteria.
     * @throws EmptyResultDataAccessException if no team is found. Handled by GlobalExceptionHandler.
     */
    @GetMapping("/teams")
    public List<Team> listTeams(@RequestParam(required = false) String name,
                                @RequestParam(required = false) String orderBy,
                                @RequestParam(required = false) String orderByDir) {
        StringBuilder sqlBuilder = new StringBuilder("""
            SELECT *
            FROM Team
            WHERE 1=1
            """);

        if (name != null && !name.isBlank()) {
            sqlBuilder.append(" AND teamName LIKE '%").append(name).append("%'");
        }
        String orderClause;
        if (orderBy != null && !orderBy.isBlank()) {
            if (orderByDir != null && orderByDir.equals("ASC")) {
                orderClause = " ORDER BY " + orderBy + " ASC";
            } else {
                orderClause = " ORDER BY " + orderBy + " DESC";
            }
        } else {
            orderClause = " ORDER BY teamStrength DESC";
        }
        sqlBuilder.append(orderClause);
        String sql = sqlBuilder.toString();
        return jdbcTemplate.query(sql, new TeamRowMapper());
    }

    /**
     * Gets a team by its ID.
     *
     * @param teamID The ID of the team to retrieve as a path variable.
     * @return The Team object with the specified ID.
     * @throws EmptyResultDataAccessException if no team is found. Handled by GlobalExceptionHandler.
     */
    @GetMapping("/teams/{teamID}")
    public Team getTeam(@PathVariable int teamID) {
        String sql = """
            SELECT *
            FROM Team
            WHERE Team.teamID = ?
            """;
        Team team = jdbcTemplate.queryForObject(sql, new TeamRowMapper(), teamID);

//      // Get best player in each position for the team.
        String playerSql = """
            SELECT p.playerID, p.playerName, p.playerAge, t.teamID, t.teamName, p.position, p.score, COUNT(s.year) AS numSeasons, SUM(s.games) AS numGames,
            AVG(s.passYds) AS avgpassYds, AVG(s.passTDs) AS avgpassTDs, AVG(s.ints) AS avgints, AVG(s.compPct) AS avgcompPct,
            AVG(s.rshAtt) AS avgrshAtt, AVG(s.rshYds) AS avgrshYds, AVG(s.rshTDs) AS avgrshTDs, AVG(s.rec) AS avgrec,\s
            AVG(s.recYds) AS avgrecYds, AVG(s.recTDs) AS avgrecTDs
            FROM Player p JOIN Statistics s USING(playerID) JOIN Team t USING(teamID)
            WHERE t.teamID = ? AND p.position = ? AND p.score IN (
                SELECT MAX(p2.score)
                FROM Player AS p2
                WHERE p2.position = ?
                GROUP BY p2.teamID
            )
            GROUP BY p.playerID
            LIMIT 1
            """;

        team.setTopQB(jdbcTemplate.queryForObject(playerSql, new PlayerRowMapper(), teamID, "QB", "QB"));
        team.setTopRB(jdbcTemplate.queryForObject(playerSql, new PlayerRowMapper(), teamID, "RB", "RB"));
        team.setTopWR(jdbcTemplate.queryForObject(playerSql, new PlayerRowMapper(), teamID, "WR", "WR"));
        team.setTopTE(jdbcTemplate.queryForObject(playerSql, new PlayerRowMapper(), teamID, "TE", "TE"));

        return team;
    }

}
