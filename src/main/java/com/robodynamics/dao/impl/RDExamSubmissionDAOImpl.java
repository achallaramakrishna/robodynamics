package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDExamSubmissionDAO;
import com.robodynamics.model.RDExamSubmission;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RDExamSubmissionDAOImpl implements RDExamSubmissionDAO {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    /* ==============================
       SAVE
       ============================== */
    @Override
    public RDExamSubmission save(RDExamSubmission submission) {
        getCurrentSession().save(submission);
        return submission;
    }

    /* ==============================
       UPDATE
       ============================== */
    @Override
    public RDExamSubmission update(RDExamSubmission submission) {
        getCurrentSession().update(submission);
        return submission;
    }

    /* ==============================
       FIND BY ID
       ============================== */
    @Override
    public RDExamSubmission findById(Integer submissionId) {

        String hql =
            "SELECT s " +
            "FROM RDExamSubmission s " +
            "LEFT JOIN FETCH s.files " +
            "WHERE s.submissionId = :id";

        return sessionFactory
                .getCurrentSession()
                .createQuery(hql, RDExamSubmission.class)
                .setParameter("id", submissionId)
                .uniqueResult();
    }


    /* ==============================
       FIND LATEST SUBMISSION
       ============================== */
    @Override
    public RDExamSubmission findLatestByExamAndStudent(
            Integer examPaperId,
            Integer studentId
    ) {
        String hql = """
            FROM RDExamSubmission s
            WHERE s.examPaperId = :examPaperId
              AND s.studentId = :studentId
            ORDER BY s.submissionId DESC
        """;

        Query<RDExamSubmission> query =
                getCurrentSession().createQuery(hql, RDExamSubmission.class);

        query.setParameter("examPaperId", examPaperId);
        query.setParameter("studentId", studentId);
        query.setMaxResults(1);

        return query.uniqueResult();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDExamSubmission> findByStudentAndSession(
            Integer studentId,
            Integer sessionId
    ) {

        String hql =
            "SELECT s " +
            "FROM RDExamSubmission s, RDExamPaper p " +
            "WHERE s.examPaperId = p.examPaperId " +
            "AND s.studentId = :studentId " +
            "AND p.session.sessionId = :sessionId " +
            "ORDER BY s.submissionId DESC";

        return sessionFactory
                .getCurrentSession()
                .createQuery(hql)
                .setParameter("studentId", studentId)
                .setParameter("sessionId", sessionId)
                .list();
    }

    @Override
    public RDExamSubmission findByIdWithFiles(Integer submissionId) {
        String hql = """
            select distinct s
            from RDExamSubmission s
            left join fetch s.filePaths fp
            where s.submissionId = :id
        """;

        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDExamSubmission.class)
                .setParameter("id", submissionId)
                .uniqueResult();
    }


}
