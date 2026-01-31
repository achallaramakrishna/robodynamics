package com.robodynamics.dao.impl;

import java.util.List;
import java.util.Map;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDExamPaperDAO;
import com.robodynamics.model.RDExamPaper;

@Repository
public class RDExamPaperDAOImpl implements RDExamPaperDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(RDExamPaper paper) {
        sessionFactory.getCurrentSession().save(paper);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> findBySessionDetail(Integer sessionDetailId) {

        return (List<Map<String, Object>>) (List<?>)
            sessionFactory
                .getCurrentSession()
                .createQuery(
                    "select new map(" +
                    "   ep.examPaperId as examPaperId, " +
                    "   ep.title as paperTitle, " +
                    "   ep.subject as paperSubject, " +
                    "   ep.examYear as paperYear, " +
                    "   ep.status as paperStatus" +
                    ") " +
                    "from RDExamPaper ep " +
                    "where ep.courseSessionDetail.courseSessionDetailId = :id " +
                    "order by ep.createdAt desc"
                )
                .setParameter("id", sessionDetailId)
                .list();
    }


    @Override
    public RDExamPaper getExamPaperWithDetails(Integer examPaperId) {

        String hql =
            "select distinct ep " +
            "from RDExamPaper ep " +
            "left join fetch ep.sections s " +
            "left join fetch s.questions sq " +
            "left join fetch sq.question q " +
            "where ep.examPaperId = :id " +
            "order by s.sectionOrder, sq.displayOrder";

        return sessionFactory
                .getCurrentSession()
                .createQuery(hql, RDExamPaper.class)
                .setParameter("id", examPaperId)
                .uniqueResult();
    }

    @Override
    public void delete(Integer examPaperId) {
        RDExamPaper paper =
                sessionFactory.getCurrentSession()
                              .get(RDExamPaper.class, examPaperId);
        if (paper != null) {
            sessionFactory.getCurrentSession().delete(paper);
        }
    }
}
