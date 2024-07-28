package com.robodynamics.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCourseSessionDetailDao;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;

@Repository
@Transactional
public class RDCourseSessionDetailDaoImpl implements RDCourseSessionDetailDao {

	@Autowired
	private SessionFactory factory;
	
	
	@Override
	public void saveRDCourseSession(RDCourseSessionDetail rdCourseSessionDetail) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdCourseSessionDetail);
	}

	@Override
	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId) {
		 Session session = factory.getCurrentSession();
		 RDCourseSessionDetail courseSessionDetail = session.get(RDCourseSessionDetail.class, courseSessionDetailId);
	     return courseSessionDetail;
	}

	@Override
	public List<RDCourseSessionDetail> getRDCourseSessionDetails(int courseId) {
		
		return factory.getCurrentSession().createCriteria(RDCourseSessionDetail.class)
				.createAlias("courseSession","courseSession")
                .createAlias("courseSession.course", "course")
                .add(Restrictions.eq("course.courseId", courseId))
                .list();
		
		/*
		 * Session session = factory.getCurrentSession(); CriteriaBuilder cb =
		 * session.getCriteriaBuilder(); CriteriaQuery < RDCourseSessionDetail > cq =
		 * cb.createQuery(RDCourseSessionDetail.class); Root < RDCourseSessionDetail >
		 * root = cq.from(RDCourseSessionDetail.class);
		 * 
		 * Predicate condition = cb.equal(root.get("course.courseId"), courseId);
		 * cq.where(condition); // cq.select(root); Query query =
		 * session.createQuery(cq); return query.getResultList();
		 */
	}

	@Override
	public void deleteRDCourseSessionDetail(int id) {
		Session session = factory.getCurrentSession();
		RDCourseSessionDetail courseSessionDetail = session.byId(RDCourseSessionDetail.class).load(id);
        session.delete(courseSessionDetail);

	}

}
