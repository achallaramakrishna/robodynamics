package com.robodynamics.dao;

import com.robodynamics.model.RDMatchingGame;
import java.util.List;

public interface RDMatchingGameDao {

    RDMatchingGame getGameById(Long gameId);

    List<RDMatchingGame> getAllGames();

    void saveGame(RDMatchingGame game);
}
