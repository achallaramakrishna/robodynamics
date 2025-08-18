package com.robodynamics.dao.impl;

import java.util.List;
import java.util.Optional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDTestAttemptDao;
import com.robodynamics.model.RDTestAttempt;

@Repository
@Transactional
public class RDTestAttemptDaoImpl implements RDTestAttemptDao {

    private final SessionFactory sessionFactory;

    public RDTestAttemptDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() { return sessionFactory.getCurrentSession(); }

    @Override
    public Integer save(RDTestAttempt attempt) {
        return (Integer) s().save(attempt);
    }

    @Override
    public void update(RDTestAttempt attempt) {
        s().merge(attempt);
    }

    @Override
    public Optional<RDTestAttempt> findByTestAndEnrollment(Integer testId, Integer enrollmentId) {
        String hql = """
            from RDTestAttempt a
            where a.test.testId = :tid and a.enrollmentId = :eid
        """;
        Query<RDTestAttempt> q = s().createQuery(hql, RDTestAttempt.class);
        q.setParameter("tid", testId);
        q.setParameter("eid", enrollmentId);
        return q.uniqueResultOptional();
    }

    @Override
    public List<RDTestAttempt> findAllByTest(Integer testId) {
        String hql = "from RDTestAttempt a where a.test.testId = :tid order by a.createdAt desc";
        Query<RDTestAttempt> q = s().createQuery(hql, RDTestAttempt.class);
        q.setParameter("tid", testId);
        return q.getResultList();
    }

    @Override
    public Object[] summary(Integer testId) {
        String hql = """
            select count(a), avg(a.scoreObtained), min(a.scoreObtained), max(a.scoreObtained)
            from RDTestAttempt a
            where a.test.testId = :tid
        """;
        Query<Object[]> q = s().createQuery(hql, Object[].class);
        q.setParameter("tid", testId);
        return q.uniqueResultOptional().orElse(new Object[] {0L, null, null, null});
    }

    @Override
    public void deleteByTest(Integer testId) {
        String hql = "delete from RDTestAttempt a where a.test.testId = :tid";
        s().createQuery(hql).setParameter("tid", testId).executeUpdate();
    }
}
