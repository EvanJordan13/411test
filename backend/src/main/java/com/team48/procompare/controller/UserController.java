package com.team48.procompare.controller;

import com.team48.procompare.model.Player;
import com.team48.procompare.model.User;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private final JdbcTemplate jdbcTemplate;

    RowMapper<User> rowMapper = (result, rowNum) -> {
        User u = new User();
        return u;
    };

    public UserController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Gets a single user and their favorite players.
     *
     * @param username The username of the user to retrieve as a path variable.
     * @return The specified user.
     * @throws EmptyResultDataAccessException if no user is found. Handled by GlobalExceptionHandler.
     */
    @GetMapping("/users/{username}")
    public User getUser(@PathVariable String username) {
        String sql = """
            SELECT u.username, f.playerID, p.playerName
            FROM Users u JOIN Favorites f USING(username) JOIN Players p USING(playerID)
            WHERE u.username = ?
            """;
        return jdbcTemplate.queryForObject(sql, rowMapper, username);
    }

    /**
     * Creates a new user in the database.
     *
     * @param username The username of the user to create as a request parameter.
     */
    @PostMapping("/users")
    public void createUser(@RequestParam String username) {
        // TODO: Implement user creation logic.
    }

    /**
     * Deletes a user from the database.
     *
     * @param username The username of the user to delete as a path variable.
     */
    @DeleteMapping("/users/{username}")
    public void deleteUser(@PathVariable String username) {
        // TODO: Implement user deletion logic.
    }

    /**
     * Adds a player to a user's favorites.
     *
     * @param username The username of the user to add the player to as a path variable.
     * @param playerID The ID of the player to add as a request parameter.
     */
    @PostMapping("/users/{username}/favorites")
    public void addFavorite(@PathVariable String username, @RequestParam String playerID) {
        // TODO: Implement add favorite logic.
    }

    /**
     * Removes a player from a user's favorites.
     *
     * @param username The username of the user to remove the player from as a path variable.
     * @param playerID The ID of the player to remove as a path variable.
     */
    @DeleteMapping("/users/{username}/favorites/{playerID}")
    public void deleteFavorite(@PathVariable String username, @PathVariable String playerID) {
        // TODO: Implement delete favorite logic.
    }

}
