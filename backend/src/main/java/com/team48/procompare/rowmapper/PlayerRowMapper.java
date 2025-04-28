package com.team48.procompare.rowmapper;
import com.team48.procompare.model.Player;
import com.team48.procompare.model.PositionEnum;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PlayerRowMapper implements RowMapper<Player> {

    @Override
    public Player mapRow(ResultSet result, int rowNum) throws SQLException {
        Player player = new Player();
        player.setPlayerID(result.getString("playerID"));
        player.setPlayerName(result.getString("playerName"));
        player.setPlayerAge(result.getInt("playerAge"));
        player.setTeamId(result.getInt("teamID"));
        player.setTeamName(result.getString("teamName"));
        player.setScore(result.getFloat("score"));
        player.setNumSeasons(result.getInt("numSeasons"));
        player.setNumGames(result.getInt("numGames"));

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
    }
}
