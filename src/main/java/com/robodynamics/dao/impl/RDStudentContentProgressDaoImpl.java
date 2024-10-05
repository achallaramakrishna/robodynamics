package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDStudentContentProgressDao;
import com.robodynamics.model.RDStudentContentProgress;

@Repository
@Transactional
public class RDStudentContentProgressDaoImpl implements RDStudentContentProgressDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveOrUpdate(RDStudentContentProgress contentProgress) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(contentProgress);
    }

    @Override
    public RDStudentContentProgress findById(int contentProgressId) {
        Session session = factory.getCurrentSession();
        return session.get(RDStudentContentProgress.class, contentProgressId);
    }

    @Override
    public RDStudentContentProgress findBySessionAndContentType(int sessionProgressId, String contentType) {
        CriteriaBuilder cb = factory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<RDStudentContentProgress> cq = cb.createQuery(RDStudentContentProgress.class);
        Root<RDStudentContentProgress> root = cq.from(RDStudentContentProgress.class);
        cq.select(root).where(
            cb.equal(root.get("sessionProgress").get("id"), sessionProgressId),
            cb.equal(root.get("contentType"), contentType)
        );
        return factory.getCurrentSession().createQuery(cq).uniqueResult();
    }

    @Override
    public List<RDStudentContentProgress> findAllBySessionProgressId(int sessionProgressId) {
        CriteriaBuilder cb = factory.getCurrentSession().getCriteriaBuilder();
        CriteriaQuery<RDStudentContentProgress> cq = cb.createQuery(RDStudentContentProgress.class);
        Root<RDStudentContentProgress> root = cq.from(RDStudentContentProgress.class);
        cq.select(root).where(cb.equal(root.get("sessionProgress").get("id"), sessionProgressId));
        return factory.getCurrentSession().createQuery(cq).getResultList();
    }

    @Override
    public void delete(RDStudentContentProgress contentProgress) {
        Session session = factory.getCurrentSession();
        session.delete(contentProgress);
    }
    
    @Override
    public Double findProgressByStudentAndSessionDetail(int enrollmentId, int sessionDetailId) {
        String hql = "SELECT progress FROM RDStudentContentProgress WHERE sessionProgress.enrollment.enrollmentId = :enrollmentId AND courseSessionDetail.courseSessionDetailId = :sessionDetailId";
        
        List<Double> results = factory.getCurrentSession()
                                      .createQuery(hql, Double.class)
                                      .setParameter("enrollmentId", enrollmentId)
                                      .setParameter("sessionDetailId", sessionDetailId)
                                      .getResultList();
        
        // Check if results exist
        if (results == null || results.isEmpty()) {
            return null;  // Return null or handle no progress scenario
        }
        
        // If there are multiple progress entries (unexpected scenario), handle it
        // You can choose the first one or aggregate the progress in some way
        return results.get(0);  // Return the first result if found
    }

    
    @Override
    public double calculateOverallProgress(int sessionProgressId) {
        Session session = factory.getCurrentSession();
        
        String hql = "SELECT AVG(progress) FROM RDStudentContentProgress WHERE sessionProgress.id = :sessionProgressId";
        
        Double overallProgress = (Double) session.createQuery(hql)
                .setParameter("sessionProgressId", sessionProgressId)
                .uniqueResult();
        
        return overallProgress != null ? overallProgress : 0.0;
    }
    
    @Override
    public RDStudentContentProgress findBySessionAndContentType(int sessionProgressId, int sessionDetailId, String contentType) {
    	 String hql = "FROM RDStudentContentProgress WHERE sessionProgress.id = :sessionProgressId AND courseSessionDetail.id = :sessionDetailId AND contentType = :contentType";
    	    
    	    List<RDStudentContentProgress> result = factory.getCurrentSession()
    	            .createQuery(hql, RDStudentContentProgress.class)
    	            .setParameter("sessionProgressId", sessionProgressId)
    	            .setParameter("sessionDetailId", sessionDetailId)
    	            .setParameter("contentType", contentType)
    	            .getResultList();

    	    if (result.isEmpty()) {
    	        return null; // No progress found
    	    }

    	    return result.get(0); // Return the first (and ideally only) result

    }


}
