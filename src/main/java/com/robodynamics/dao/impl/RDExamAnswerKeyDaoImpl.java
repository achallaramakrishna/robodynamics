package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.SessionFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDExamAnswerKeyDao;
import com.robodynamics.model.RDExamAnswerKey;

@Repository
@Transactional
public class RDExamAnswerKeyDaoImpl implements RDExamAnswerKeyDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDExamAnswerKey answerKey) {
        factory.getCurrentSession().saveOrUpdate(answerKey);
    }

    @Override
    public RDExamAnswerKey getById(int answerKeyId) {
        return factory.getCurrentSession()
                .get(RDExamAnswerKey.class, answerKeyId);
    }

    /**
     * Primary lookup used during AI evaluation
     * (Unique constraint exists on exam_section_question_id)
     */
    @Override
    public RDExamAnswerKey findBySectionQuestionId(int examSectionQuestionId) {
        String hql = "FROM RDExamAnswerKey k " +
                     "WHERE k.sectionQuestion.id = :sectionQuestionId";

        Query<RDExamAnswerKey> query = factory.getCurrentSession().createQuery(hql);
        query.setParameter("sectionQuestionId", examSectionQuestionId);

        return query.uniqueResult();
    }

    @Override
    public RDExamAnswerKey findByExamAndQuestion(
            int examPaperId,
            int examSectionQuestionId,
            int questionId) {

        String hql = "FROM RDExamAnswerKey k " +
                     "WHERE k.examPaper.examPaperId = :paperId " +
                     "AND k.sectionQuestion.id = :sectionQuestionId " +
                     "AND k.question.questionId = :questionId";

        Query<RDExamAnswerKey> query = factory.getCurrentSession().createQuery(hql);
        query.setParameter("paperId", examPaperId);
        query.setParameter("sectionQuestionId", examSectionQuestionId);
        query.setParameter("questionId", questionId);

        return query.uniqueResult();
    }

    @Override
    public List<RDExamAnswerKey> findByExamPaperId(int examPaperId) {
        String hql = "FROM RDExamAnswerKey k " +
                     "WHERE k.examPaper.examPaperId = :paperId " +
                     "ORDER BY k.sectionQuestion.id ASC";

        return factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("paperId", examPaperId)
                .list();
    }

    @Override
    public List<RDExamAnswerKey> findByQuestionId(int questionId) {
        String hql = "FROM RDExamAnswerKey k " +
                     "WHERE k.question.questionId = :questionId";

        return factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("questionId", questionId)
                .list();
    }

    /**
     * Used when exam paper is deleted or re-uploaded
     */
    @Override
    public void deleteByExamPaperId(int examPaperId) {
        String hql = "DELETE FROM RDExamAnswerKey k " +
                     "WHERE k.examPaper.examPaperId = :paperId";

        factory.getCurrentSession()
                .createQuery(hql)
                .setParameter("paperId", examPaperId)
                .executeUpdate();
    }
}
