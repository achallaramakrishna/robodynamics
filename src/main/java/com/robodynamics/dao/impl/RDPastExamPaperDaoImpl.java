package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDPastExamPaperDao;
import com.robodynamics.model.RDPastExamPaper;
import com.robodynamics.model.RDExamCourse;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizOption;

import java.util.List;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class RDPastExamPaperDaoImpl implements RDPastExamPaperDao {

	@Autowired
    private SessionFactory sessionFactory;

    @Override
    public void savePastExamPaper(RDPastExamPaper pastExamPaper) {
        sessionFactory.getCurrentSession().save(pastExamPaper);
    }

    @Override
    public void saveExamCourse(RDExamCourse examCourse) {
        sessionFactory.getCurrentSession().save(examCourse);
    }

    @Override
    public void saveQuizQuestion(RDQuizQuestion question) {
        sessionFactory.getCurrentSession().save(question);
    }

    @Override
    public void saveQuizOption(RDQuizOption option) {
        sessionFactory.getCurrentSession().save(option);
    }

    @Override
    public List<Integer> getDistinctYears() {
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT DISTINCT p.examYear FROM RDPastExamPaper p", Integer.class)
                .getResultList();
    }

    @Override
    public List<String> getExamList() {
        return sessionFactory.getCurrentSession()
                .createQuery("SELECT DISTINCT p.examName FROM RDPastExamPaper p", String.class)
                .getResultList();
    }

    @Override
    public List<RDPastExamPaper> findExamPapersByFilters(Integer year, Integer examId) {
        // Example HQL query with filters for year and examId
        String queryStr = "FROM RDPastExamPaper p WHERE 1=1";
        if (year != null) {
            queryStr += " AND p.examYear = :year";
        }
        if (examId != null) {
            queryStr += " AND p.examId = :examId";
        }

        var query = sessionFactory.getCurrentSession().createQuery(queryStr, RDPastExamPaper.class);
        if (year != null) {
            query.setParameter("year", year);
        }
        if (examId != null) {
            query.setParameter("examId", examId);
        }

        return query.getResultList();
    }

    @Override
    public RDPastExamPaper findExamPaperById(int examPaperId) {
        return sessionFactory.getCurrentSession().get(RDPastExamPaper.class, examPaperId);
    }
}

