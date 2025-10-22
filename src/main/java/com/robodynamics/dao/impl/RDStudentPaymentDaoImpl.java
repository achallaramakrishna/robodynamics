package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDStudentPaymentDao;
import com.robodynamics.model.RDStudentPayment;

@Repository
public class RDStudentPaymentDaoImpl implements RDStudentPaymentDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session session() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDStudentPayment payment) {
        session().save(payment);
    }

    @Override
    public void update(RDStudentPayment payment) {
        session().update(payment);
    }

    @Override
    public void delete(Integer paymentId) {
        RDStudentPayment sp = findById(paymentId);
        if (sp != null) session().delete(sp);
    }

    @Override
    public RDStudentPayment findById(Integer paymentId) {
        return session().get(RDStudentPayment.class, paymentId);
    }

    @Override
    public List<RDStudentPayment> findAll() {
        String hql = "FROM RDStudentPayment p " +
                     "LEFT JOIN FETCH p.student s " +
                     "LEFT JOIN FETCH p.parent pr " +
                     "LEFT JOIN FETCH p.enrollment e " +
                     "ORDER BY p.paymentDate DESC";
        return session().createQuery(hql, RDStudentPayment.class).list();
    }

	@Override
	public boolean existsByEnrollmentAndMonth(Integer enrollmentId, String month) {
		Session session = sessionFactory.getCurrentSession();
        String hql = "select count(p) from RDStudentPayment p "
                   + "where p.enrollment.enrollmentId = :enrollmentId and p.monthFor = :month";
        Long count = (Long) session.createQuery(hql)
                .setParameter("enrollmentId", enrollmentId)
                .setParameter("month", month)
                .uniqueResult();
        return count != null && count > 0;
	}

	@Override
	public boolean existsForMonth(String month) {
		Session session = sessionFactory.getCurrentSession();
        String hql = "SELECT COUNT(p.paymentId) FROM RDStudentPayment p WHERE p.monthFor = :month";
        Query<Long> query = session.createQuery(hql, Long.class);
        query.setParameter("month", month);
        Long count = query.uniqueResult();
        return count != null && count > 0;
	}
}
