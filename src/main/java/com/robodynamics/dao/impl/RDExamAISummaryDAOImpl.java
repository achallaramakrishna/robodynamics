package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDExamAISummaryDAO;
import com.robodynamics.model.RDExamAIEvaluation;
import com.robodynamics.model.RDExamAISummary;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class RDExamAISummaryDAOImpl implements RDExamAISummaryDAO {

    @PersistenceContext
    private EntityManager entityManager;

    /* ================= SUMMARY ================= */

    @Override
    public void save(RDExamAISummary summary) {
        entityManager.persist(summary);
    }

    @Override
    public void update(RDExamAISummary summary) {
        entityManager.merge(summary);
    }

    @Override
    public RDExamAISummary findBySubmissionId(Integer submissionId) {

        TypedQuery<RDExamAISummary> query =
                entityManager.createQuery(
                    "SELECT s FROM RDExamAISummary s " +
                    "WHERE s.submission.submissionId = :submissionId",
                    RDExamAISummary.class
                );

        query.setParameter("submissionId", submissionId);

        return query.getResultStream().findFirst().orElse(null);
    }

    /* ================= PER-QUESTION AI RESULTS ================= */

    @Override
    public List<RDExamAIEvaluation> findBySubmissionIdOrderByQuestionOrder(
            Integer submissionId
    ) {

        TypedQuery<RDExamAIEvaluation> query =
                entityManager.createQuery(
                    "SELECT e FROM RDExamAIEvaluation e " +
                    "WHERE e.submission.submissionId = :submissionId " +
                    "ORDER BY e.questionOrder ASC",
                    RDExamAIEvaluation.class
                );

        query.setParameter("submissionId", submissionId);

        return query.getResultList();
    }

    @Override
    public void saveOrUpdate(RDExamAISummary summary) {
        if (summary.getId() == null) {
            entityManager.persist(summary);
        } else {
            entityManager.merge(summary);
        }
    }


}
