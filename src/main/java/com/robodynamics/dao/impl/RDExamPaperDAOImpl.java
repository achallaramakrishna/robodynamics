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
import com.robodynamics.model.RDExamSection;
import com.robodynamics.model.RDExamSectionQuestion;
import com.robodynamics.model.RDQuizQuestion;

@Repository
public class RDExamPaperDAOImpl implements RDExamPaperDAO {

    @Autowired
    private SessionFactory sessionFactory;
    
    @Override
    public boolean hasSubmissions(Integer examPaperId) {

        String hql = """
            select count(s.submissionId)
            from RDExamSubmission s
            where s.examPaper.examPaperId = :paperId
        """;

        Long count = sessionFactory.getCurrentSession()
                .createQuery(hql, Long.class)
                .setParameter("paperId", examPaperId)
                .uniqueResult();

        return count != null && count > 0;
    }


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
            "select distinct ep\r\n"
            + "from RDExamPaper ep\r\n"
            + "left join fetch ep.sections s\r\n"
            + "left join fetch s.questions sq\r\n"
            + "left join fetch sq.question q\r\n"
            + "left join fetch q.options o\r\n"
            + "where ep.examPaperId = :id\r\n"
            + "order by s.sectionOrder, sq.displayOrder";

        RDExamPaper paper =  sessionFactory
                .getCurrentSession()
                .createQuery(hql, RDExamPaper.class)
                .setParameter("id", examPaperId)
                .uniqueResult();
        
        // 🔹 Step 2: Explicitly initialize MCQ options
        initializeQuestionOptions(paper);

        return paper;
    }
    
    private void initializeQuestionOptions(RDExamPaper paper) {

        if (paper == null || paper.getSections() == null) return;

        for (RDExamSection section : paper.getSections()) {
            if (section.getQuestions() == null) continue;

            for (RDExamSectionQuestion sq : section.getQuestions()) {
                RDQuizQuestion q = sq.getQuestion();

                if (q != null
                    && "multiple_choice".equalsIgnoreCase(q.getQuestionType())) {

                    // Force lazy collection initialization safely
                    q.getOptions().size();
                }
            }
        }
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
	        "join d.courseSession s " +
	        "where s.courseSessionId = :sessionId " +
	        "order by p.createdAt desc";

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
