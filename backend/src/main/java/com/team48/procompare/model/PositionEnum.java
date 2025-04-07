package com.team48.procompare.model;

import java.util.List;

public enum PositionEnum {
    QB(List.of("passYds", "passTDs", "ints", "compPct")),
    RB(List.of("rshAtt", "rshYds", "rshTDs")),
    WR(List.of("rec", "recYds", "recTDs")),
    TE(List.of("rec", "recYds", "recTDs"));

    private final List<String> stats;

    PositionEnum(List<String> stats) {
        this.stats = stats;
    }

    public List<String> getStats() {
        return stats;
    }
}
