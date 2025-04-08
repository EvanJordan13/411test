package com.team48.procompare.model;

import java.util.List;
import com.team48.procompare.model.Player;

public class User {
    private String username;
    private List<Player> favorites;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<Player> getFavorites() {
        return favorites;
    }

    public void setFavorites(List<Player> favorites) {
        this.favorites = favorites;
    }
}
