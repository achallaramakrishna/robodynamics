package com.robodynamics.dao.impl;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDFinancialReportDao;
import com.robodynamics.model.RDFinancialReport;

@Repository
public class RDFinancialReportDaoImpl implements RDFinancialReportDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session session() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDFinancialReport report) {
        session().save(report);
    }

    @Override
    public void update(RDFinancialReport report) {
        session().update(report);
    }

    @Override
    public void delete(Integer reportId) {
        RDFinancialReport r = findById(reportId);
        if (r != null) session().delete(r);
    }

    @Override
    public RDFinancialReport findById(Integer reportId) {
        return session().get(RDFinancialReport.class, reportId);
    }

    @Override
    public List<RDFinancialReport> findAll() {
        String hql = "FROM RDFinancialReport ORDER BY reportMonth DESC";
        return session().createQuery(hql, RDFinancialReport.class).list();
    }

    @Override
    public RDFinancialReport findByMonth(String reportMonth) {
        String hql = "FROM RDFinancialReport WHERE reportMonth = :month";
        return session().createQuery(hql, RDFinancialReport.class)
                .setParameter("month", reportMonth)
                .uniqueResult();
    }
}
