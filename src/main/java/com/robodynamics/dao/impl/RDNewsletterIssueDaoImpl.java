package com.robodynamics.dao.impl;

import java.time.LocalDate;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDNewsletterIssueDao;
import com.robodynamics.model.RDNewsletterIssue;

@Repository
public class RDNewsletterIssueDaoImpl implements RDNewsletterIssueDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDNewsletterIssue issue) {
        getCurrentSession().saveOrUpdate(issue);
    }

    @Override
    public RDNewsletterIssue findById(Long issueId) {
        if (issueId == null) {
            return null;
        }
        return getCurrentSession().get(RDNewsletterIssue.class, issueId);
    }

    @Override
    public RDNewsletterIssue findByWeekStart(LocalDate weekStart) {
        if (weekStart == null) {
            return null;
        }
        return getCurrentSession()
                .createQuery("FROM RDNewsletterIssue n WHERE n.weekStart = :weekStart", RDNewsletterIssue.class)
                .setParameter("weekStart", weekStart)
                .setMaxResults(1)
                .uniqueResult();
    }

    @Override
    public List<RDNewsletterIssue> findLatest(int limit) {
        int maxRows = Math.max(1, Math.min(limit, 200));
        return getCurrentSession()
                .createQuery("FROM RDNewsletterIssue n ORDER BY n.weekStart DESC, n.issueId DESC", RDNewsletterIssue.class)
                .setMaxResults(maxRows)
                .getResultList();
    }
}
