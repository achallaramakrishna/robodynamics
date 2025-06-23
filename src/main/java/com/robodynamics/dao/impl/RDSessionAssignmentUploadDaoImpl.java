package com.robodynamics.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDSessionAssignmentUploadDao;
import com.robodynamics.model.RDSessionAssignmentUpload;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDUser;

@Repository
@Transactional
public class RDSessionAssignmentUploadDaoImpl implements RDSessionAssignmentUploadDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void saveUpload(RDSessionAssignmentUpload upload) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(upload);
    }
    
    @Override
    public RDSessionAssignmentUpload getUpload(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(RDSessionAssignmentUpload.class, id);
    }

    @Override
    public List<RDSessionAssignmentUpload> getAllUploads() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDSessionAssignmentUpload> cq = cb.createQuery(RDSessionAssignmentUpload.class);
        cq.from(RDSessionAssignmentUpload.class);
        return session.createQuery(cq).getResultList();
    }

    @Override
    public List<RDSessionAssignmentUpload> getUploadsByStudent(RDUser student) {
    	 Session session = sessionFactory.getCurrentSession();
    	    return session.createQuery(
    	        "SELECT u " +
    	        "FROM RDSessionAssignmentUpload u " +
    	        "JOIN FETCH u.sessionDetail sd " +
    	        "JOIN FETCH sd.courseSession cs " +
    	        "WHERE u.student = :student",
    	        RDSessionAssignmentUpload.class)
    	        .setParameter("student", student)
    	        .getResultList();
    }

    @Override
    public List<RDSessionAssignmentUpload> getUploadsByStudentAndSessionDetail(RDUser student, RDCourseSessionDetail sessionDetail) {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery(
                "SELECT u " +
                "FROM RDSessionAssignmentUpload u " +
                "JOIN FETCH u.sessionDetail sd " +
                "JOIN FETCH sd.courseSession cs " +
                "WHERE u.student = :student AND u.sessionDetail = :sessionDetail", 
                RDSessionAssignmentUpload.class)
                .setParameter("student", student)
                .setParameter("sessionDetail", sessionDetail)
                .getResultList();
    }

    @Override
    public void deleteUpload(Long id) {
        Session session = sessionFactory.getCurrentSession();
        RDSessionAssignmentUpload upload = session.byId(RDSessionAssignmentUpload.class).load(id);
        session.delete(upload);
    }

	@Override
	public void update(RDSessionAssignmentUpload upload) {
		 sessionFactory.getCurrentSession().update(upload);
		
	}
}
