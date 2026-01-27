package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDMatchPairDAO;
import com.robodynamics.model.RDMatchPair;

@Repository
public class RDMatchPairDAOImpl implements RDMatchPairDAO {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public void save(RDMatchPair pair) {
        getSession().saveOrUpdate(pair);
    }

    @Override
    public RDMatchPair findById(int id) {
        return getSession().get(RDMatchPair.class, id);
    }

    @Override
    public List<RDMatchPair> findByQuestionId(int matchQuestionId) {
        return getSession()
                .createQuery("""
                    from RDMatchPair
                    where matchQuestion.matchQuestionId = :qid
                    order by displayOrder asc
                """, RDMatchPair.class)
                .setParameter("qid", matchQuestionId)
                .getResultList();
    }

    @Override
    public void delete(int pairId) {
        RDMatchPair pair = findById(pairId);
        if (pair != null) {
            getSession().delete(pair);
        }
    }

    @Override
    public void deleteByQuestionId(int matchQuestionId) {
        getSession()
            .createQuery("""
                delete from RDMatchPair
                where matchQuestion.matchQuestionId = :qid
            """)
            .setParameter("qid", matchQuestionId)
            .executeUpdate();
    }

	@Override
	public int findCourseIdByMatchPairId(int matchPairId) {
		 return (int) sessionFactory.getCurrentSession()
			        .createQuery("""
			            select cs.course.courseId
			            from RDMatchPair mp
			            join mp.matchQuestion mq
			            join mq.courseSessionDetail cs
			            where mp.matchPairId = :pid
			        """)
			        .setParameter("pid", matchPairId)
			        .uniqueResult();
	}

}
