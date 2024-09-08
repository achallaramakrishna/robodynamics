package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserQuestDao;
import com.robodynamics.model.RDUserQuest;

@Repository
@Transactional
public class RDUserQuestDaoImpl implements RDUserQuestDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDUserQuest userQuest) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(userQuest);
    }

    @Override
    public List<RDUserQuest> findByUserId(int userId) {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDUserQuest> cq = cb.createQuery(RDUserQuest.class);
        Root<RDUserQuest> root = cq.from(RDUserQuest.class);
        cq.select(root).where(cb.equal(root.get("user"), userId));
        return session.createQuery(cq).getResultList();
    }

    @Override
    public List<RDUserQuest> findAll() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDUserQuest> cq = cb.createQuery(RDUserQuest.class);
        Root<RDUserQuest> root = cq.from(RDUserQuest.class);
        cq.select(root);
        return session.createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDUserQuest userQuest) {
        Session session = factory.getCurrentSession();
        session.delete(userQuest);
    }
    @Override
    public RDUserQuest findByUserIdAndQuestId(int userId, int questId) {
    	Session session = factory.getCurrentSession();
        Query<RDUserQuest> query = session.createQuery("from RDUserQuest where user.id = :userId and quest.id = :questId", RDUserQuest.class);
        query.setParameter("userId", userId);
        query.setParameter("questId", questId);
        return query.uniqueResult(); // Return a single result, or null if none
    }

    @Override
    public int countQuizzesCompletedByUser(int userId) {
    	Session session = factory.getCurrentSession();
        Query<Long> query = session.createQuery(
            "select count(*) from RDUserQuizResults where user.id = :userId", Long.class);
        query.setParameter("userId", userId);
        return query.uniqueResult().intValue(); // Convert the count result to int
    }

    @Override
    public boolean isQuestCompletedByUser(int userId, int questId) {
        Session session = factory.getCurrentSession();
        Query<Long> query = session.createQuery(
            "SELECT COUNT(*) FROM RDUserQuest WHERE user.id = :userId AND quest.id = :questId", 
            Long.class
        );
        query.setParameter("userId", userId);
        query.setParameter("questId", questId);

        // If the count is greater than 0, it means the quest has been completed by the user
        return query.uniqueResult() > 0;
    }
}
