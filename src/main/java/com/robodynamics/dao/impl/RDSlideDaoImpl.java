package com.robodynamics.dao.impl;



import java.util.List;

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
public class RDSlideDaoImpl implements RDSlideDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDSlide(RDSlide slide) {
    	Session session = factory.getCurrentSession();
		session.saveOrUpdate(slide);
    }

   
    @Override
    public List<RDSlide> getAllSlides() {
    	
    	Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDSlide > cq = cb.createQuery(RDSlide.class);
        Root < RDSlide > root = cq.from(RDSlide.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public RDSlide getSlideById(int slideId) {
    	
    	Session session = factory.getCurrentSession();
        RDSlide rdSlide = session.get(RDSlide.class, slideId);
        return rdSlide;    
    }


	@Override
	public List<RDSlide> getSlidesBySessionDetailId(int sessionDetailId) {
		Session session = factory.getCurrentSession();
		Query<RDSlide> query = session.createQuery("from RDSlide where courseSessionDetail.courseSessionDetailId = :sessionDetailId order by slideOrder ASC", RDSlide.class);
        query.setParameter("sessionDetailId", sessionDetailId);
        return query.getResultList();
	}


	
	
}
