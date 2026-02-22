package com.robodynamics.dao.impl;

import java.time.LocalDateTime;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserLoginLogDao;
import com.robodynamics.model.RDUserLoginLog;

@Repository
@Transactional
public class RDUserLoginLogDaoImpl implements RDUserLoginLogDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void save(RDUserLoginLog loginLog) {
        Session session = factory.getCurrentSession();
        session.save(loginLog);
    }

    @Override
    public long countDistinctUsersLoggedIn() {
        Session session = factory.getCurrentSession();
        Long count = session.createQuery(
                "select count(distinct l.user.userID) from RDUserLoginLog l",
                Long.class
        ).uniqueResult();
        return count == null ? 0L : count;
    }

    @Override
    public long countDistinctUsersLoggedInSince(LocalDateTime since) {
        Session session = factory.getCurrentSession();
        Long count = session.createQuery(
                "select count(distinct l.user.userID) from RDUserLoginLog l where l.loginTime >= :since",
                Long.class
        ).setParameter("since", since).uniqueResult();
        return count == null ? 0L : count;
    }

    @Override
    public long countLoginsSince(LocalDateTime since) {
        Session session = factory.getCurrentSession();
        Long count = session.createQuery(
                "select count(l.loginLogId) from RDUserLoginLog l where l.loginTime >= :since",
                Long.class
        ).setParameter("since", since).uniqueResult();
        return count == null ? 0L : count;
    }
}
