package com.team48.procompare.model;

public class Article {
    private int articleID;
    private String headlines;
    private String userID;
    private int numUpvotes;
    private int numDownvotes;

    public int getArticleID() {
        return articleID;
    }
    public void setArticleID(int articleID) {
        this.articleID = articleID;
    }

    public String getHeadlines() {
        return headlines;
    }
    public void setHeadlines(String headlines) {
        this.headlines = headlines;
    }

    public String getUserID() {
        return userID;
    }
    public void setUserID(String userID) {
        this.userID = userID;
    }

    public int getNumUpvotes() {
        return numUpvotes;
    }
    public void setNumUpvotes(int numUpvotes) {
        this.numUpvotes = numUpvotes;
    }

    public int getNumDownvotes() {
        return numDownvotes;
    }
    public void setNumDownvotes(int numDownvotes) {
        this.numDownvotes = numDownvotes;
    }
}
