package com.team48.procompare.model;

import java.util.List;
import com.team48.procompare.model.Player;

public class User {
    private int username;
    private List<Player> favorites;

    public int getUsername() {
        return username;
    }

    public void setUsername(int username) {
        this.username = username;
    }

    public List<Player> getFavorites() {
        return favorites;
    }

    public void setFavorites(List<Player> favorites) {
        this.favorites = favorites;
    }
}
