package com.robodynamics.dao;

import com.robodynamics.model.RDExamAIEvaluation;
import org.springframework.stereotype.Repository;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

@Repository
public class RDExamAIEvaluationDAO {

    @PersistenceContext
    private EntityManager em;
    
    public RDExamAIEvaluation findBySubmissionAndSectionQuestion(
            Integer submissionId,
            Integer sectionQuestionId
    ) {
        return em.createQuery(
                "SELECT e FROM RDExamAIEvaluation e " +
                "WHERE e.submission.submissionId = :submissionId " +
                "AND e.sectionQuestion.id = :sqId",
                RDExamAIEvaluation.class
        )
        .setParameter("submissionId", submissionId)
        .setParameter("sqId", sectionQuestionId)
        .getResultStream()
        .findFirst()
        .orElse(null);
    }
    
    public void deleteBySubmissionId(Integer submissionId) {

        em.createQuery(
                """
                DELETE FROM RDExamAIEvaluation e
                WHERE e.submission.submissionId = :submissionId
                """
        )
        .setParameter("submissionId", submissionId)
        .executeUpdate();
    }


    public void save(RDExamAIEvaluation evaluation) {
        em.persist(evaluation);
    }
    
    public List<RDExamAIEvaluation>
    findBySubmissionIdOrderByQuestionOrder(Integer submissionId) {

        String jpql = """
            SELECT e
            FROM RDExamAIEvaluation e
            WHERE e.submission.submissionId = :submissionId
            ORDER BY e.questionOrder ASC
        """;

        TypedQuery<RDExamAIEvaluation> query =
                em.createQuery(
                        jpql,
                        RDExamAIEvaluation.class
                );

        query.setParameter("submissionId", submissionId);

        return query.getResultList();
    }
}
