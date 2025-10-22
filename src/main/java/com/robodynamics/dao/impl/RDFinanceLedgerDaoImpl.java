package com.robodynamics.dao.impl;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDFinanceLedgerDao;
import com.robodynamics.model.RDFinanceLedger;

@Repository
public class RDFinanceLedgerDaoImpl implements RDFinanceLedgerDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session session() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDFinanceLedger ledger) {
        session().save(ledger);
    }

    @Override
    public void update(RDFinanceLedger ledger) {
        session().update(ledger);
    }

    @Override
    public void delete(Integer ledgerId) {
        RDFinanceLedger entry = findById(ledgerId);
        if (entry != null) session().delete(entry);
    }

    @Override
    public RDFinanceLedger findById(Integer ledgerId) {
        return session().get(RDFinanceLedger.class, ledgerId);
    }

    @Override
    public List<RDFinanceLedger> findAll() {
        String hql = "FROM RDFinanceLedger ORDER BY transactionDate DESC, ledgerId DESC";
        return session().createQuery(hql, RDFinanceLedger.class).list();
    }
}
