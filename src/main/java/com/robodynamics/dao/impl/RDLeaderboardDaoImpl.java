package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDLeaderboardDao;
import com.robodynamics.model.RDLeaderboard;

@Repository
@Transactional
public class RDLeaderboardDaoImpl implements RDLeaderboardDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public List<RDLeaderboard> findTopUsers(int limit) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDLeaderboard> cq = cb.createQuery(RDLeaderboard.class);
        Root<RDLeaderboard> root = cq.from(RDLeaderboard.class);
        cq.select(root).orderBy(cb.desc(root.get("totalPoints")));
        return session.createQuery(cq).setMaxResults(limit).getResultList();
    }

    @Override
    public RDLeaderboard findByUserId(int userId) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDLeaderboard> cq = cb.createQuery(RDLeaderboard.class);
        Root<RDLeaderboard> root = cq.from(RDLeaderboard.class);
        cq.select(root).where(cb.equal(root.get("user"), userId));
        return session.createQuery(cq).uniqueResult();
    }

    @Override
    public List<RDLeaderboard> findAll() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDLeaderboard> cq = cb.createQuery(RDLeaderboard.class);
        Root<RDLeaderboard> root = cq.from(RDLeaderboard.class);
        cq.select(root).orderBy(cb.desc(root.get("totalPoints")));
        return session.createQuery(cq).getResultList();
    }
}
