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

        String hql = """
            SELECT s
            FROM RDExamSubmission s
            JOIN s.examPaper p
            JOIN p.courseSessionDetail d
            JOIN d.courseSession cs
            WHERE s.studentId = :studentId
              AND cs.courseSessionId = :sessionId
            ORDER BY s.submissionId DESC
        """;

        return getCurrentSession()
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

	@Override
	public int markEvaluationStarted(Integer submissionId) {
		// TODO Auto-generated method stub
		return sessionFactory
	            .getCurrentSession()
	            .createQuery(
	                "UPDATE RDExamSubmission s " +
	                "SET s.evaluationStarted = true, " +
	                "    s.status = :status " +
	                "WHERE s.submissionId = :id " +
	                "  AND s.evaluationStarted = false"
	            )
	            .setParameter(
	                "status",
	                RDExamSubmission.SubmissionStatus.EVALUATING
	            )
	            .setParameter("id", submissionId)
	            .executeUpdate();
	}

	@Override
	public int markEvaluatingIfSubmitted(Integer submissionId) {

	    return sessionFactory.getCurrentSession()
	        .createQuery(
	            "update RDExamSubmission s " +
	            "set s.status = :evaluating " +
	            "where s.submissionId = :id " +
	            "and s.status = :submitted"
	        )
	        .setParameter("evaluating",
	                RDExamSubmission.SubmissionStatus.EVALUATING)
	        .setParameter("submitted",
	                RDExamSubmission.SubmissionStatus.SUBMITTED)
	        .setParameter("id", submissionId)
	        .executeUpdate();
	}

	@Override
	public boolean markEvaluatingIfAllowed(Integer submissionId) {

	    int updated =
	        sessionFactory
	            .getCurrentSession()
	            .createQuery(
	                "update RDExamSubmission s " +
	                "set s.status = :evaluating " +
	                "where s.submissionId = :id " +
	                "and s.status = :submitted"
	            )
	            .setParameter(
	                "evaluating",
	                RDExamSubmission.SubmissionStatus.EVALUATING
	            )
	            .setParameter(
	                "submitted",
	                RDExamSubmission.SubmissionStatus.SUBMITTED
	            )
	            .setParameter("id", submissionId)
	            .executeUpdate();

	    if (updated == 1) {
	        System.out.println(
	            "✅ STATE CHANGE: SUBMITTED → EVALUATING for submissionId="
	            + submissionId
	        );
	        return true;
	    }

	    System.out.println(
	        "⛔ markEvaluatingIfAllowed skipped for submissionId="
	        + submissionId + " (already evaluating or evaluated)"
	    );
	    return false;
	}


	    @Override
	    public RDExamSubmission findLatestByStudentAndPaper(
	            Integer studentId,
	            Integer paperId
	    ) {

	        Session session = sessionFactory.getCurrentSession();

	        String hql = """
	            FROM RDExamSubmission s
	            WHERE s.studentId = :studentId
	              AND s.examPaperId = :paperId
	            ORDER BY s.submissionId DESC
	        """;

	        RDExamSubmission result = session.createQuery(hql, RDExamSubmission.class)
	                .setParameter("studentId", studentId)
	                .setParameter("paperId", paperId)
	                .setMaxResults(1)
	                .uniqueResult();

	        System.out.println("DAO → Latest submissionId = " +
	                (result != null ? result.getSubmissionId() : "NULL"));

	        return result;
	    }

}
