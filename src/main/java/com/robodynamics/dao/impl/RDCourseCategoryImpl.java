package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.NoResultException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.robodynamics.dao.RDCourseCategoryDao;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDCourseCategory;

@Repository
@Transactional
public class RDCourseCategoryImpl implements RDCourseCategoryDao {

	@Autowired
	private SessionFactory factory;

	@Override
	public void saveRDCourseCategory(RDCourseCategory rdCourseCategory) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdCourseCategory);
	}

	@Override
	public RDCourseCategory getRDCourseCategory(int courseCategoryId) {
		Session session = factory.getCurrentSession();
        RDCourseCategory rdCourseCategory = session.get(RDCourseCategory.class, courseCategoryId);
        return rdCourseCategory;

	}

	@Override
	public List<RDCourseCategory> getRDCourseCategories() {
        Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDCourseCategory > cq = cb.createQuery(RDCourseCategory.class);
        Root < RDCourseCategory > root = cq.from(RDCourseCategory.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();

	}

	@Override
	public void deleteRDCourseCategory(int id) {
        Session session = factory.getCurrentSession();
        RDCourseCategory rdCourseCategory = session.byId(RDCourseCategory.class).load(id);
        session.delete(rdCourseCategory);
	

	}

}
