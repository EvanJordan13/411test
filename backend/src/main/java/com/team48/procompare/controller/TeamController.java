package com.team48.procompare.controller;

import com.team48.procompare.model.Team;
import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.JdbcTemplate;

@RestController
public class TeamController {
    private final JdbcTemplate jdbcTemplate;

    RowMapper<Team> rowMapper = (result, rowNum) -> {
        Team team = new Team();
        team.setTeamID(result.getInt("teamID"));
        team.setTeamName(result.getString("teamName"));
        team.setTeamStrength(result.getFloat("teamStrength"));
        return team;
    };

    public TeamController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Lists and sorts teams given request parameters.
     * TODO: Implement sorting and filtering.
     *
     * @return List of Team objects that match criteria.
     * @throws EmptyResultDataAccessException if no team is found. Handled by GlobalExceptionHandler.
     */
    @GetMapping("/teams")
    public List<Team> listTeams() {
        String sql = """
            SELECT *
            FROM Team
            """;
        return jdbcTemplate.query(sql, rowMapper);
    }

}
