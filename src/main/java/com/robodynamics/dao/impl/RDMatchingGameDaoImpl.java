package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMatchingGameDao;
import com.robodynamics.model.RDMatchingGame;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class RDMatchingGameDaoImpl implements RDMatchingGameDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    @Transactional(readOnly = true)
    public RDMatchingGame getGameById(Long gameId) {
        return sessionFactory.getCurrentSession().get(RDMatchingGame.class, gameId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingGame> getAllGames() {
        return sessionFactory.getCurrentSession().createQuery("from RDMatchingGame", RDMatchingGame.class).list();
    }

    @Override
    @Transactional
    public void saveGame(RDMatchingGame game) {
        sessionFactory.getCurrentSession().saveOrUpdate(game);
    }
}
