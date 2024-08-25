package com.robodynamics.dao.impl;


import java.util.List;

import com.robodynamics.dao.RDFillInBlankQuestionDao;
import com.robodynamics.dao.RDSlideDao;
import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.model.RDSlide;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;




@Repository
@Transactional
public class RDFillInBlankQuestionDaoImpl implements RDFillInBlankQuestionDao {

	@Autowired
	private SessionFactory factory;


    @Override
    public void saveRDFillInBlankQuestion(RDFillInBlankQuestion question) {
    	Session session = factory.getCurrentSession();
		session.saveOrUpdate(question);
    }

    @Override
    public List<RDFillInBlankQuestion> getQuestionsBySlideId(int slideId) {
    	
    	Session session = factory.getCurrentSession();
        Query<RDFillInBlankQuestion> query = session.createQuery("from RDFillInBlankQuestion where slide.slideId=:slideId", RDFillInBlankQuestion.class);
        query.setParameter("slideId", slideId);
        return query.getResultList();
    }
}
