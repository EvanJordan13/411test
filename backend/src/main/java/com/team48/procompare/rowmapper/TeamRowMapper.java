package com.team48.procompare.rowmapper;

import com.team48.procompare.model.Team;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class TeamRowMapper implements RowMapper<Team> {

    @Override
    public Team mapRow(ResultSet result, int rowNum) throws SQLException {
        Team team = new Team();
        team.setTeamID(result.getInt("teamID"));
        team.setTeamName(result.getString("teamName"));
        team.setTeamStrength(result.getFloat("teamStrength"));
        return team;
    }
}
