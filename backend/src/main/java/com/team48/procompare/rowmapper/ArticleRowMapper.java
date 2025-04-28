package com.team48.procompare.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.team48.procompare.model.Article;

public class ArticleRowMapper implements RowMapper<Article> {
    @Override
    public Article mapRow(ResultSet rs, int rowNum) throws SQLException {
        Article a = new Article();
        a.setArticleID(rs.getInt("articleID"));
        a.setHeadlines(rs.getString("headlines"));
        a.setUserID(rs.getString("userID"));
        a.setNumUpvotes(rs.getInt("numUpvotes"));
        a.setNumDownvotes(rs.getInt("numDownvotes"));
        return a;
    }
}
