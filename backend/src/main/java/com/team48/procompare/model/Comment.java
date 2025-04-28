package com.team48.procompare.model;

public class Comment {
    private int commentID;
    private int articleID;
    private String userID;
    private String text;
    
    public int getCommentID() {
        return commentID;
    }
    public void setCommentID(int commentID) {
        this.commentID = commentID;
    }

    public int getArticleID() {
        return articleID;
    }
    public void setArticleID(int articleID) {
        this.articleID = articleID;
    }

    public String getUserID() {
        return userID;
    }
    public void setUserID(String userID) {
        this.userID = userID;
    }

    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
}
