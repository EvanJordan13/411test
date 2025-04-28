package com.team48.procompare.model;

public class Team {
    private int teamID;
    private String teamName;
    private Float teamStrength;
    private Player topQB;
    private Player topRB;
    private Player topWR;
    private Player topTE;

    public int getTeamID() {
        return teamID;
    }

    public void setTeamID(int teamID) {
        this.teamID = teamID;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Float getTeamStrength() {
        return teamStrength;
    }

    public void setTeamStrength(Float teamStrength) {
        this.teamStrength = teamStrength;
    }

    public Player getTopQB() {
        return topQB;
    }

    public void setTopQB(Player topQB) {
        this.topQB = topQB;
    }

    public Player getTopRB() {
        return topRB;
    }

    public void setTopRB(Player topRB) {
        this.topRB = topRB;
    }

    public Player getTopWR() {
        return topWR;
    }

    public void setTopWR(Player topWR) {
        this.topWR = topWR;
    }

    public Player getTopTE() {
        return topTE;
    }

    public void setTopTE(Player topTE) {
        this.topTE = topTE;
    }
}
