package com.team48.procompare.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.team48.procompare.model.Comment;

public class CommentRowMapper implements RowMapper<Comment> {
    @Override
    public Comment mapRow(ResultSet rs, int rowNum) throws SQLException {
        Comment c = new Comment();
        c.setCommentID(rs.getInt("commentID"));
        c.setArticleID(rs.getInt("articleID"));
        c.setUserID(rs.getString("userID"));
        c.setText(rs.getString("text"));
        return c;
    }
}