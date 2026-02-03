package com.robodynamics.dao.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDExamAttemptDao;
import com.robodynamics.model.RDExamAttempt;

@Repository
@Transactional
public class RDExamAttemptDAOImpl implements RDExamAttemptDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDExamAttempt attempt) {
        factory.getCurrentSession().saveOrUpdate(attempt);
    }

    @Override
    public RDExamAttempt getById(int attemptId) {
        return factory.getCurrentSession().get(RDExamAttempt.class, attemptId);
    }

    @Override
    public RDExamAttempt findActiveAttempt(int examPaperId, int enrollmentId, int studentId) {
        String hql = "FROM RDExamAttempt a " +
                     "WHERE a.examPaper.examPaperId = :paperId " +
                     "AND a.enrollment.enrollmentId = :enrollId " +
                     "AND a.student.userId = :studentId " +
                     "AND a.status = 'IN_PROGRESS' " +
                     "ORDER BY a.startTime DESC";

        Query<RDExamAttempt> query = factory.getCurrentSession().createQuery(hql);
        query.setParameter("paperId", examPaperId);
        query.setParameter("enrollId", enrollmentId);
        query.setParameter("studentId", studentId);
        query.setMaxResults(1);

        return query.uniqueResult();
    }

    @Override
    public RDExamAttempt findLatestAttempt(int examPaperId, int enrollmentId, int studentId) {
        String hql = "FROM RDExamAttempt a " +
                     "WHERE a.examPaper.examPaperId = :paperId " +
                     "AND a.enrollment.enrollmentId = :enrollId " +
                     "AND a.student.userId = :studentId " +
                     "ORDER BY a.createdAt DESC";

        Query<RDExamAttempt> query = factory.getCurrentSession().createQuery(hql);
        query.setParameter("paperId", examPaperId);
        query.setParameter("enrollId", enrollmentId);
        query.setParameter("studentId", studentId);
        query.setMaxResults(1);

        return query.uniqueResult();
    }

    @Override
    public List<RDExamAttempt> findAttemptsByEnrollment(int enrollmentId) {
        String hql = "FROM RDExamAttempt a " +
                     "WHERE a.enrollment.enrollmentId = :enrollId " +
                     "ORDER BY a.createdAt DESC";

        return factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("enrollId", enrollmentId)
                .list();
    }

    @Override
    public List<RDExamAttempt> findAttemptsByExamPaper(int examPaperId) {
        String hql = "FROM RDExamAttempt a " +
                     "WHERE a.examPaper.examPaperId = :paperId " +
                     "ORDER BY a.createdAt DESC";

        return factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("paperId", examPaperId)
                .list();
    }

    @Override
    public void markSubmitted(int attemptId) {
        Session session = factory.getCurrentSession();
        RDExamAttempt attempt = session.get(RDExamAttempt.class, attemptId);

        if (attempt == null) return;

        attempt.setStatus(RDExamAttempt.AttemptStatus.SUBMITTED);
        attempt.setEndTime(LocalDateTime.now());
        session.update(attempt);
    }

    @Override
    public void markEvaluated(int attemptId, double totalScore) {
        Session session = factory.getCurrentSession();
        RDExamAttempt attempt = session.get(RDExamAttempt.class, attemptId);

        if (attempt == null) return;

        attempt.setStatus(RDExamAttempt.AttemptStatus.EVALUATED);
        attempt.setTotalScore(BigDecimal.valueOf(totalScore));

        session.update(attempt);
    }

    @Override
    public boolean hasAnyAttempt(int examPaperId, int enrollmentId, int studentId) {
        String hql = "SELECT COUNT(a.attemptId) " +
                     "FROM RDExamAttempt a " +
                     "WHERE a.examPaper.examPaperId = :paperId " +
                     "AND a.enrollment.enrollmentId = :enrollId " +
                     "AND a.student.userId = :studentId";

        Long count = (Long) factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("paperId", examPaperId)
                .setParameter("enrollId", enrollmentId)
                .setParameter("studentId", studentId)
                .uniqueResult();

        return count != null && count > 0;
    }
}
