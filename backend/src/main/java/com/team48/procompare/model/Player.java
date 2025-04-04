package com.team48.procompare.model;

public class Player {
    private String playerID;
    private String playerName;
    private int playerAge;
    private int teamId;
    private String teamName;
    private String position;
    private Float score;

    public Player() {}

    public Player(String playerName, int playerAge, int teamId, String teamName, String position, Float score) {
        this.playerName = playerName;
        this.playerAge = playerAge;
        this.teamId = teamId;
        this.teamName = teamName;
        this.position = position;
        this.score = score;
    }

    public String getPlayerID() {
        return playerID;
    }

    public void setPlayerID(String playerID) {
        this.playerID = playerID;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public int getPlayerAge() {
        return playerAge;
    }

    public void setPlayerAge(int playerAge) {
        this.playerAge = playerAge;
    }

    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Float getScore() {
        return score;
    }

    public void setScore(Float score) {
        this.score = score;
    }
}
