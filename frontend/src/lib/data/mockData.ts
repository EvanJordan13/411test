import { Player } from "@/types";

export const allPlayers: Player[] = [
  {
    id: 1,
    name: "Patrick Mahomes",
    team: "KC",
    position: "QB",
    stats: {
      "Passing Yards": 4839,
      Touchdowns: 41,
      "Completion %": 67.2,
      "QB Rating": 105.3,
      Interceptions: 12,
      "Yards/Attempt": 8.1,
    },
    mlScore: 94,
    trend: "up",
    lastUpdated: "2024-02-16",
    note: "Consistent performer, great for playoff weeks",
    recentNews: [
      {
        id: 1,
        title: "Mahomes leads Chiefs to victory with 3 TDs",
        date: "2024-02-16",
        source: "ESPN",
      },
      {
        id: 2,
        title: "Chiefs QB sets franchise record for passing yards",
        date: "2024-02-10",
        source: "NFL Network",
      },
    ],
  },
  {
    id: 2,
    name: "Josh Allen",
    team: "BUF",
    position: "QB",
    stats: {
      "Passing Yards": 4544,
      Touchdowns: 37,
      "Completion %": 65.8,
      "QB Rating": 101.2,
      Interceptions: 14,
      "Yards/Attempt": 7.8,
    },
    mlScore: 92,
    trend: "up",
    lastUpdated: "2024-02-14",
    recentNews: [
      {
        id: 1,
        title: "Allen's dual-threat ability on full display in Bills victory",
        date: "2024-02-15",
        source: "ESPN",
      },
      {
        id: 2,
        title: "Bills QB sets franchise record for total touchdowns",
        date: "2024-02-13",
        source: "NFL Network",
      },
    ],
  },
  {
    id: 3,
    name: "Travis Kelce",
    team: "KC",
    position: "TE",
    stats: {
      Receptions: 93,
      Yards: 984,
      Touchdowns: 5,
      "Yards/Reception": 10.6,
      Targets: 121,
      "Catch %": 76.9,
    },
    mlScore: 89,
    trend: "down",
    lastUpdated: "2024-02-15",
    note: "Check injury status before week 13",
    recentNews: [
      {
        id: 1,
        title: "Kelce has season-low targets in week 12",
        date: "2024-02-14",
        source: "ESPN",
      },
      {
        id: 2,
        title: "Chiefs TE showing signs of slowing down",
        date: "2024-02-12",
        source: "NFL Network",
      },
    ],
  },
];

export const teams = [
  { id: 1, code: "KC", name: "Kansas City Chiefs", strength: 0.92 },
  { id: 2, code: "BUF", name: "Buffalo Bills", strength: 0.9 },
  { id: 3, code: "SF", name: "San Francisco 49ers", strength: 0.89 },
  { id: 4, code: "MIA", name: "Miami Dolphins", strength: 0.87 },
  { id: 5, code: "DAL", name: "Dallas Cowboys", strength: 0.86 },
];

export const users = [
  {
    username: "currentUser",
    favorites: [1, 3],
  },
];
