package com.robodynamics.dao.impl;

import java.util.List;
import java.util.Map;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDExamPaperDAO;
import com.robodynamics.model.RDExamAnswerKey;
import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDExamSectionQuestion;

@Repository
public class RDExamPaperDAOImpl implements RDExamPaperDAO {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(RDExamPaper paper) {
        sessionFactory.getCurrentSession().save(paper);
    }

    @Override
    public RDExamPaper findBySessionDetail(Integer sessionDetailId) {

        return sessionFactory.getCurrentSession()
            .createQuery(
                "select p " +
                "from RDExamPaper p " +
                "where p.courseSessionDetail.courseSessionDetailId = :sid",
                RDExamPaper.class
            )
            .setParameter("sid", sessionDetailId)
            .uniqueResult();
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

	@Override
	public List<RDExamPaper> findAll() {

		    return sessionFactory
		            .getCurrentSession()
		            .createQuery("from RDExamPaper", RDExamPaper.class)
		            .getResultList();
	}

	@Override
	public List<RDExamAnswerKey> getAnswerKeysByExamPaper(Integer examPaperId) {
		 Session session = sessionFactory.getCurrentSession();

	        String hql = """
	            select ak
	            from RDExamAnswerKey ak
	            join fetch ak.sectionQuestion sq
	            join fetch ak.question q
	            where ak.examPaper.examPaperId = :examPaperId
	        """;

	        Query<RDExamAnswerKey> query =
	                session.createQuery(hql);

	        query.setParameter("examPaperId", examPaperId);

	        return query.getResultList();
	}

	  /* ================= UPDATE (EXISTING) ================= */
    @Override
    public void update(RDExamPaper paper) {

        /*
         * paper MUST be attached or have a valid primary key.
         * In your UPSERT flow, this is guaranteed.
         */
		 Session session = sessionFactory.getCurrentSession();

        session.update(paper);
    }

	@Override
	public RDExamPaper merge(RDExamPaper paper) {
		
		Session session = sessionFactory.getCurrentSession();

		return (RDExamPaper)session.merge(paper);
	}

	@Override
	public List<RDExamPaper> getExamPapersBySession(Integer sessionId) {

	    String hql =
	        "select distinct p " +
	        "from RDExamPaper p " +
	        "join p.courseSessionDetail d " +
	        "join d.session s " +
	        "where s.sessionId = :sessionId " +
	        "order by p.createdOn desc";

	    return sessionFactory
	            .getCurrentSession()
	            .createQuery(hql, RDExamPaper.class)
	            .setParameter("sessionId", sessionId)
	            .getResultList();
	}

	@Override
	public RDExamSectionQuestion getSectionQuestionById(
	        Integer sectionQuestionId
	) {
	    Session session = sessionFactory.getCurrentSession();

	    return session.get(
	            RDExamSectionQuestion.class,
	            sectionQuestionId
	    );
	}


}
