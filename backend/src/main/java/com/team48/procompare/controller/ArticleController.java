package com.team48.procompare.controller;

import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.team48.procompare.model.Article;
import com.team48.procompare.model.Comment;
import com.team48.procompare.rowmapper.ArticleRowMapper;
import com.team48.procompare.rowmapper.CommentRowMapper;
import com.team48.procompare.service.ArticleService;

@RestController
@RequestMapping("/articles")
public class ArticleController {
    private final JdbcTemplate jdbcTemplate;
    private final ArticleService articleService;
    private final ArticleRowMapper articleMapper = new ArticleRowMapper();
    private final CommentRowMapper commentMapper = new CommentRowMapper();
    private static final int DOWNVOTE_THRESHOLD = 5;

    public ArticleController(JdbcTemplate jdbcTemplate, ArticleService articleService) {
        this.jdbcTemplate = jdbcTemplate;
        this.articleService = articleService;
    }

    // List all articles
    @GetMapping
    public List<Article> listArticles() {
        String sql = "SELECT * FROM Articles";
        return jdbcTemplate.query(sql, articleMapper);
    }

    // Get single article
    @GetMapping("/{id}")
    public Article getArticle(@PathVariable int id) {
        try {
            return jdbcTemplate.queryForObject(
                "SELECT * FROM Articles WHERE articleID = ?",
                articleMapper, id);
        } catch (EmptyResultDataAccessException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found", e);
        }
    }

    // Create a new article
    @PostMapping
    public void createArticle(@RequestParam int articleID,
                              @RequestParam String headlines,
                              @RequestParam String userID) {
        String sql = "INSERT INTO Articles(articleID, headlines, userID, numUpvotes, numDownvotes) VALUES(?, ?, ?, 0, 0)";
        jdbcTemplate.update(sql, articleID, headlines, userID);
    }

    // Upvote
    @PostMapping("/{id}/upvote")
    public void upvote(@PathVariable int id) {
        String sql = "UPDATE Articles SET numUpvotes = numUpvotes + 1 WHERE articleID = ?";
        jdbcTemplate.update(sql, id);
    }

    // Downvote (and delete if threshold reached)
    @PostMapping("/{id}/downvote")
    public void downvote(@PathVariable int id) {
        String sqlInc = "UPDATE Articles SET numDownvotes = numDownvotes + 1 WHERE articleID = ?";
        jdbcTemplate.update(sqlInc, id);

        Integer downs = jdbcTemplate.queryForObject(
            "SELECT numDownvotes FROM Articles WHERE articleID = ?",
            Integer.class, id);
        if (downs != null && downs >= DOWNVOTE_THRESHOLD) {
            jdbcTemplate.update("DELETE FROM Articles WHERE articleID = ?", id);
        }
    }

    // List comments for an article
    @GetMapping("/{id}/comments")
    public List<Comment> listComments(@PathVariable int id) {
        String sql = "SELECT * FROM Comments WHERE articleID = ?";
        return jdbcTemplate.query(sql, commentMapper, id);
    }

    // Add a comment
    @PostMapping("/{id}/comments")
    public void addComment(@PathVariable int id,
                           @RequestParam int commentID,
                           @RequestParam String userID,
                           @RequestParam String text) {
        String sql = "INSERT INTO Comments(commentID, articleID, userID, text) VALUES(?, ?, ?, ?)";
        jdbcTemplate.update(sql, commentID, id, userID, text);
    }

    // Delete a comment (only author)
    @DeleteMapping("/{articleId}/comments/{commentId}")
    public void deleteComment(@PathVariable int articleId,
                              @PathVariable int commentId,
                              @RequestParam String userID) {
        // Check ownership
        String ownerSql = "SELECT userID FROM Comments WHERE commentID = ?";
        String owner;
        try {
            owner = jdbcTemplate.queryForObject(ownerSql, String.class, commentId);
        } catch (EmptyResultDataAccessException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment not found", e);
        }
        if (!owner.equals(userID)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot delete others' comments");
        }
        jdbcTemplate.update("DELETE FROM Comments WHERE commentID = ?", commentId);
    }

    @PostMapping("/articles/with-news")
    public void createArticleWithNews(
        @RequestParam String username,
        @RequestParam int articleID,
        @RequestParam String headline,
        @RequestParam String userID,
        @RequestParam String playerID
    ) {
        articleService.createArticleAndLinkIfCredible(
            username, articleID, headline, userID, playerID
        );
    }

}

