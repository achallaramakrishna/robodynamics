// com.robodynamics.dao.impl.RDTestSessionMappingDaoImpl
package com.robodynamics.dao.impl;

import java.util.List;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.robodynamics.dao.RDTestSessionMappingDao;
import com.robodynamics.model.*;

@Repository
@Transactional
public class RDTestSessionMappingDaoImpl implements RDTestSessionMappingDao {

    private final SessionFactory sessionFactory;
    public RDTestSessionMappingDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public void save(RDTestSession link) {
        sessionFactory.getCurrentSession().saveOrUpdate(link);
    }

    @Override
    public void delete(Integer testId, Integer courseSessionId) {
        RDTestSessionId id = new RDTestSessionId(testId, courseSessionId);
        RDTestSession link = sessionFactory.getCurrentSession().get(RDTestSession.class, id);
        if (link != null) sessionFactory.getCurrentSession().delete(link);
    }

    @Override
    public void deleteByTestId(Integer testId) {
        sessionFactory.getCurrentSession()
            .createQuery("delete from RDTestSession l where l.id.testId = :tid")
            .setParameter("tid", testId)
            .executeUpdate();
    }

    @Override
    public boolean exists(Integer testId, Integer courseSessionId) {
        Long cnt = sessionFactory.getCurrentSession()
            .createQuery(
                "select count(l) from RDTestSession l " +
                "where l.id.testId = :tid and l.id.courseSessionId = :sid", Long.class)
            .setParameter("tid", testId)
            .setParameter("sid", courseSessionId)
            .uniqueResult();
        return cnt != null && cnt > 0;
    }

    @Override
    public List<RDTestSession> findByTestId(Integer testId) {
        return sessionFactory.getCurrentSession()
            .createQuery(
                "from RDTestSession l " +
                "join fetch l.courseSession " +
                "where l.id.testId = :tid", RDTestSession.class)
            .setParameter("tid", testId)
            .getResultList();
    }
}
