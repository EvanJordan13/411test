package com.team48.procompare.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ArticleService {
  private final JdbcTemplate jdbc;

  public ArticleService(JdbcTemplate jdbc) {
    this.jdbc = jdbc;
  }

  /**
   * Conditionally insert an Article and PlayerNews row,
   * only if user_credibility >= player_credibility (or player_credibility IS NULL).
   */
  @Transactional(isolation = Isolation.READ_COMMITTED)
  public void createArticleAndLinkIfCredible(
      String username,
      int articleID,
      String headline,
      String userID,
      String playerID
  ) {
    // 1) compute user_credibility
    Integer userCred = jdbc.queryForObject(
      """
      SELECT COUNT(*)
        FROM Users u
        JOIN (
          SELECT a.userID
            FROM Articles a
            JOIN Comments c USING(articleID)
           WHERE a.numUpvotes >= a.numDownvotes*2
           GROUP BY a.articleID
          HAVING COUNT(*) > 5
        ) AS Credible ON u.username = Credible.userID
       WHERE u.username = ?
      """,
      Integer.class, username
    );

    // 2) compute player_credibility
    Integer playerCred = jdbc.queryForObject(
      """
      SELECT COUNT(*)
        FROM PlayerNews pn
        JOIN (
          SELECT a.articleID
            FROM Articles a
            JOIN Comments c USING(articleID)
           WHERE a.numUpvotes >= a.numDownvotes*2
           GROUP BY a.articleID
          HAVING COUNT(*) > 5
        ) AS Credible USING(articleID)
       WHERE pn.playerID = ?
      """,
      Integer.class, playerID
    );

    // 3) apply the IF logic
    if (playerCred == null || (userCred != null && userCred >= playerCred)) {
      // insert Article first (FK constraint)
      jdbc.update(
        "INSERT INTO Articles(articleID, headlines, userID, numDownvotes, numUpvotes)\n" +
        "VALUES(?, ?, ?, 0, 0)",
        articleID, headline, userID
      );

      // then link in PlayerNews
      jdbc.update(
        "INSERT INTO PlayerNews(playerID, articleID) VALUES(?, ?)",
        playerID, articleID
      );
    }
  }
}
