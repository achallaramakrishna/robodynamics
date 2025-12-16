package com.robodynamics.dao.impl;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCompetitionRegistrationDao;
import com.robodynamics.model.RDCompetitionRegistration;

@Repository
@Transactional
public class RDCompetitionRegistrationDaoImpl implements RDCompetitionRegistrationDao {

    private final SessionFactory sessionFactory;

    public RDCompetitionRegistrationDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() { return sessionFactory.getCurrentSession(); }

    @Override
    public void save(RDCompetitionRegistration reg) {
        s().save(reg);
    }

    @Override
    public List<RDCompetitionRegistration> findByCompetition(int competitionId) {
        return s().createQuery(
            "from RDCompetitionRegistration r JOIN FETCH r.student s \r\n"
            + "        JOIN FETCH r.competition c \r\n"
            + "        WHERE r.competition.competitionId = :cid",
            RDCompetitionRegistration.class)
            .setParameter("cid", competitionId)
            .list();
    }
    @Override
    public List<RDCompetitionRegistration> findByStudent(int studentId) {

        return sessionFactory.getCurrentSession()
            .createQuery(
                "from RDCompetitionRegistration r " +
                "join fetch r.competition " +
                "join fetch r.student " +
                "where r.student.userID = :studentId",
                RDCompetitionRegistration.class
            )
            .setParameter("studentId", studentId)
            .list();
    }


    public RDCompetitionRegistration findById(int registrationId) {

        String hql = """
            SELECT r
            FROM RDCompetitionRegistration r
            JOIN FETCH r.competition
            JOIN FETCH r.student
            WHERE r.registrationId = :id
        """;

        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDCompetitionRegistration.class)
                .setParameter("id", registrationId)
                .uniqueResult();
    }


    @Override
    public boolean exists(int competitionId, int studentUserId) {
        Long count = s().createQuery(
            "select count(*) from RDCompetitionRegistration r where r.competition.competitionId = :cid and r.student.userId = :uid",
            Long.class)
            .setParameter("cid", competitionId)
            .setParameter("uid", studentUserId)
            .uniqueResult();

        return count != null && count > 0;
    }

    @Override
    public int countAllRegistrations() {
        Long count = s()
            .createQuery("SELECT COUNT(r) FROM RDCompetitionRegistration r", Long.class)
            .uniqueResult();
        return count != null ? count.intValue() : 0;
    }

	@Override
	public void update(RDCompetitionRegistration registration) {
        sessionFactory.getCurrentSession().update(registration);
	}

	@Override
	public RDCompetitionRegistration findByRazorpayOrderId(String orderId) {
	    return (RDCompetitionRegistration) sessionFactory
	        .getCurrentSession()
	        .createQuery(
	            "from RDCompetitionRegistration where razorpayOrderId = :orderId")
	        .setParameter("orderId", orderId)
	        .uniqueResult();
	}

}
