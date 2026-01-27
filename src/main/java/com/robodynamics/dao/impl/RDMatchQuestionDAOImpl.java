package com.robodynamics.dao.impl;

import java.util.Collection;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDMatchQuestionDAO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDMatchQuestion;

@Repository
public class RDMatchQuestionDAOImpl implements RDMatchQuestionDAO {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDMatchQuestion question) {
        getSession().saveOrUpdate(question);
    }

    @Override
    public RDMatchQuestion findById(int questionId) {
    	 String hql = """
    		        SELECT q
    		        FROM RDMatchQuestion q
    		        JOIN FETCH q.courseSessionDetail d
    		        JOIN FETCH d.courseSession s
    		        JOIN FETCH s.course c
    		        WHERE q.matchQuestionId = :questionId
    		    """;

    		    return sessionFactory.getCurrentSession()
    		            .createQuery(hql, RDMatchQuestion.class)
    		            .setParameter("questionId", questionId)
    		            .uniqueResult();
    }

    @Override
    public List<RDMatchQuestion> findAll() {
        return getSession()
                .createQuery("from RDMatchQuestion order by createdAt desc",
                        RDMatchQuestion.class)
                .getResultList();
    }

    @Override
    public RDMatchQuestion findPlayableBySessionDetail(int courseSessionDetailId) {
        return getSession()
                .createQuery("""
                    from RDMatchQuestion q
                    where q.courseSessionDetail.courseSessionDetailId = :sid
                      and q.active = true
                      and q.totalPairs > 0
                """, RDMatchQuestion.class)
                .setParameter("sid", courseSessionDetailId)
                .uniqueResult();
    }

    @Override
    public void delete(int id) {
        RDMatchQuestion q = findById(id);
        if (q != null) {
            getSession().delete(q);
        }
    }

    @Override
    public void updateTotalPairs(int matchQuestionId) {
        Long count = getSession()
                .createQuery("""
                    select count(p.matchPairId)
                    from RDMatchPair p
                    where p.matchQuestion.matchQuestionId = :qid
                """, Long.class)
                .setParameter("qid", matchQuestionId)
                .uniqueResult();

        getSession()
            .createQuery("""
                update RDMatchQuestion
                set totalPairs = :cnt
                where matchQuestionId = :qid
            """)
            .setParameter("cnt", count.intValue())
            .setParameter("qid", matchQuestionId)
            .executeUpdate();
    }

    @Override
    public RDMatchQuestion findBySessionDetail(int courseSessionDetailId) {

        Session session = sessionFactory.getCurrentSession();

        String hql = """
            from RDMatchQuestion mq
            where mq.courseSessionDetail.courseSessionDetailId = :csdId
        """;

        return session.createQuery(hql, RDMatchQuestion.class)
                      .setParameter("csdId", courseSessionDetailId)
                      .uniqueResult();
    }

    @Override
    public List<RDMatchQuestion> findBySessionId(int courseSessionId) {

        Session session = sessionFactory.getCurrentSession();

        String hql = """
                SELECT DISTINCT q
                FROM RDMatchQuestion q
                JOIN FETCH q.courseSessionDetail d
                JOIN d.courseSession s
                WHERE s.courseSessionId = :courseSessionId
                ORDER BY q.matchQuestionId
            """;


        return session.createQuery(hql, RDMatchQuestion.class)
                      .setParameter("courseSessionId", courseSessionId)
                      .getResultList();
    }

}
