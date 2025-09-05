
package com.robodynamics.dao.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDQuizOptionDao;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;

@Repository
public class RDQuizOptionDaoImpl implements RDQuizOptionDao {
	
	@Autowired
    private SessionFactory sessionFactory;
	
	private Session getSession() {
        return sessionFactory.getCurrentSession();
    }
	
	 @Override
	    public RDQuizOption findById(int optionId) {
	        Session session = sessionFactory.getCurrentSession();
	        return session.get(RDQuizOption.class, optionId);
	    }

	@Override
	public void saveAll(List<RDQuizOption> options) {
		Session session = getSession();
        for (RDQuizOption option : options) {
            session.saveOrUpdate(option); // Save or update each option
        }

	}

    @Override
    @Transactional
    public void deleteByQuestionId(int questionId) {
        String hql = "DELETE FROM RDQuizOption WHERE question.questionId = :questionId";
        getSession().createQuery(hql).setParameter("questionId", questionId).executeUpdate();
    }

	@Override
	public void saveOrUpdate(RDQuizOption option) {
		Session session = getSession();
		session.saveOrUpdate(option); 
	}

}
