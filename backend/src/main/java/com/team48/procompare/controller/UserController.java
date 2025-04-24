package com.team48.procompare.controller;

import com.team48.procompare.model.Player;
import com.team48.procompare.model.PositionEnum;
import com.team48.procompare.model.User;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    private final JdbcTemplate jdbcTemplate;
    private final NamedParameterJdbcTemplate namedParameterJdbcTemplate;


    RowMapper<User> rowMapper = (result, rowNum) -> {
        User u = new User();
        u.setUsername(result.getString("username"));
        List<Player> favorites = new ArrayList<>();

        return u;
    };

    public UserController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);

    }

    private final RowMapper<Player> fullPlayerRowMapper = (result, rowNum) -> {
        Player player = new Player();
        player.setPlayerID(result.getString("playerID"));
        player.setPlayerName(result.getString("playerName"));
        player.setPlayerAge(result.getInt("playerAge"));
        player.setTeamId(result.getInt("teamID"));
        player.setTeamName(result.getString("teamName"));
        player.setScore(result.getFloat("score"));

        String position = (result.getString("position"));
        player.setPosition(position);
             
        PositionEnum positionEnum = PositionEnum.valueOf(position);
        List<String> statNames = positionEnum.getStats();
        Map<String, Object> stats = new HashMap<>();

        for(String statName : statNames) {
            Object statValue = result.getObject("avg" + statName.toLowerCase());
            stats.put(statName, statValue);
                    
        }

        player.setStats(stats);
            
        
        return player;
    };

    /**
     * Gets a single user and their favorite players.
     *
     * @param username The username of the user to retrieve as a path variable.
     * @return The specified user.
     * @throws EmptyResultDataAccessException if no user is found. Handled by GlobalExceptionHandler.
     */
    @GetMapping("/users/{username}")
    public User getUser(@PathVariable String username) {
         //Find the user
         String userSql = "SELECT username FROM Users WHERE username = ?";
         User user;
         try {
             user = jdbcTemplate.queryForObject(userSql, (rs, rowNum) -> {
                 User u = new User();
                 u.setUsername(rs.getString("username"));
                 return u;
             }, username);
         } catch (EmptyResultDataAccessException e) {
             throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found", e);
         }
 
         //Get the list of favorite player IDs for the user
         String favoriteIdsSql = "SELECT playerID FROM Favorites WHERE username = ?";
         List<String> favoritePlayerIDs = jdbcTemplate.queryForList(favoriteIdsSql, String.class, username);
 
         List<Player> favoritePlayers = new ArrayList<>();
         if (!favoritePlayerIDs.isEmpty()) {
             //Fetch details for only the favorited players
             String fullFavoritesSql = """
                SELECT p.playerID, p.playerName, p.playerAge, t.teamID, t.teamName, p.position, p.score,
                AVG(s.passYds) AS avgpassyds, AVG(s.passTDs) AS avgpasstds, AVG(s.ints) AS avgints, AVG(s.compPct) AS avgcomppct,
                AVG(s.rshAtt) AS avgrshatt, AVG(s.rshYds) AS avgrshyds, AVG(s.rshTDs) AS avgrshtds, AVG(s.rec) AS avgrec,
                AVG(s.recYds) AS avgrecyds, AVG(s.recTDs) AS avgrectds
                FROM Player p
                JOIN Team t ON p.teamID = t.teamID
                LEFT JOIN Statistics s ON p.playerID = s.playerID
                WHERE p.playerID IN (:playerIDs)
                GROUP BY p.playerID, p.playerName, p.playerAge, t.teamID, t.teamName, p.position, p.score
                """;
 
             MapSqlParameterSource parameters = new MapSqlParameterSource();
             parameters.addValue("playerIDs", favoritePlayerIDs);
 
             
             favoritePlayers = namedParameterJdbcTemplate.query(fullFavoritesSql, parameters, fullPlayerRowMapper);
         }
 
         // set the list favorite players
         user.setFavorites(favoritePlayers);
 
         return user;
    }

    /**
     * Creates a new user in the database.
     *
     * @param username The username of the user to create as a request parameter.
     */
    @PostMapping("/users")
    public void createUser(@RequestParam String username) {
        String sql = "INSERT INTO Users (username) VALUES (?)";
        jdbcTemplate.update(sql, username);
    }

    /**
     * Deletes a user from the database.
     *
     * @param username The username of the user to delete as a path variable.
     */
    @DeleteMapping("/users/{username}")
    public void deleteUser(@PathVariable String username) {
        String sqlFavorites = "DELETE FROM Favorites WHERE username = ?";
        jdbcTemplate.update(sqlFavorites, username);

        String sqlUser = "DELETE FROM Users WHERE username = ?";
        jdbcTemplate.update(sqlUser, username);
    }

    /**
     * Adds a player to a user's favorites.
     *
     * @param username The username of the user to add the player to as a path variable.
     * @param playerID The ID of the player to add as a request parameter.
     */
    @PostMapping("/users/{username}/favorites")
    public void addFavorite(@PathVariable String username, @RequestParam String playerID) {
        String sql = "INSERT INTO Favorites (username, playerID) VALUES (?, ?)";
        try { 
            
             jdbcTemplate.update(sql, username, playerID);

        } catch (DuplicateKeyException e) {
            // Do nothing
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid user or id", e);
        }
    }

    /**
     * Removes a player from a user's favorites.
     *
     * @param username The username of the user to remove the player from as a path variable.
     * @param playerID The ID of the player to remove as a path variable.
     */
    @DeleteMapping("/users/{username}/favorites/{playerID}")
    public void deleteFavorite(@PathVariable String username, @PathVariable String playerID) {
        String sql = "DELETE FROM Favorites WHERE username = ? AND playerID = ?";
        jdbcTemplate.update(sql, username, playerID);
    }

}