package com.robodynamics.service;

import com.robodynamics.model.RDMatchingGame;
import java.util.List;

public interface RDMatchingGameService {

    RDMatchingGame getGameById(Long gameId);

    List<RDMatchingGame> getAllGames();

    void saveGame(RDMatchingGame game);
}
