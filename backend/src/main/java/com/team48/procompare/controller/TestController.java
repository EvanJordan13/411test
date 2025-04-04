package com.team48.procompare.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.JdbcTemplate;

@RestController
public class TestController {
    private final JdbcTemplate jdbcTemplate;

    public TestController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/getUsers")
    public List<String> getTuples() {
        return this.jdbcTemplate.queryForList("SELECT * FROM Users LIMIT 5").stream()
                .map(m -> m.values().toString())
                .collect(Collectors.toList());
    }
}
