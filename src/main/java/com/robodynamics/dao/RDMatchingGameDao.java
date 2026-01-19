package com.robodynamics.dao;

import com.robodynamics.model.RDMatchingGame;
import java.util.List;

public interface RDMatchingGameDao {

    RDMatchingGame getGameById(int gameId);

    List<RDMatchingGame> getAllGames();

    void saveGame(RDMatchingGame game);

	void deleteGame(int gameId);

	RDMatchingGame getGameByCourseSessionDetails(int courseSessionDetailId);

	List<RDMatchingGame> getGamesBySessionId(int sessionId);

	Integer countGamesBySessionId(int sessionId);

	RDMatchingGame getGameWithCategories(int gameId);
}
