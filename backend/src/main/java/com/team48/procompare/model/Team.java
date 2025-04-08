package com.team48.procompare.model;

public class Team {
    private int teamID;
    private String teamName;
    private Float teamStrength;

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
}
