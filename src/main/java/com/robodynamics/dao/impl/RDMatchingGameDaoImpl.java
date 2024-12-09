package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMatchingGameDao;
import com.robodynamics.model.RDMatchingGame;
import com.robodynamics.model.RDMatchingItem;

import org.hibernate.Query;
import org.hibernate.Session;
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
    public RDMatchingGame getGameById(int gameId) {
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

	@Override
	@Transactional
	public void deleteGame(int gameId) {
		Session session = sessionFactory.getCurrentSession();
		RDMatchingGame matchingGame = session.byId(RDMatchingGame.class).load(gameId);
	        session.delete(matchingGame);
		
	}

	@Override
	@Transactional
	public RDMatchingGame getGameByCourseSessionDetails(int courseSessionDetailId) {
		Session session = sessionFactory.getCurrentSession();
	    try {
	        // Create HQL query to fetch the matching game by courseSessionDetailId
	        String hql = "FROM RDMatchingGame WHERE courseSessionDetail.courseSessionDetailId = :courseSessionDetailId";
	        Query<RDMatchingGame> query = session.createQuery(hql, RDMatchingGame.class);
	        query.setParameter("courseSessionDetailId", courseSessionDetailId);

	        // Return a single result or null if no matching game is found
	        return query.uniqueResult();
	    } catch (Exception e) {
	        e.printStackTrace();
	        return null; // Handle exception as needed
	    }
	}

	
}
