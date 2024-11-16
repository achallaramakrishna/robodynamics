package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMatchingGameDao;
import com.robodynamics.model.RDMatchingGame;
import com.robodynamics.service.RDMatchingGameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RDMatchingGameServiceImpl implements RDMatchingGameService {

    @Autowired
    private RDMatchingGameDao matchingGameDao;

    @Override
    @Transactional(readOnly = true)
    public RDMatchingGame getGameById(Long gameId) {
        return matchingGameDao.getGameById(gameId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingGame> getAllGames() {
        return matchingGameDao.getAllGames();
    }

    @Override
    @Transactional
    public void saveGame(RDMatchingGame game) {
        matchingGameDao.saveGame(game);
    }
}
