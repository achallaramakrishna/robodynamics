package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDAssignmentDao;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDAssignment;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import java.util.List;

@Repository
@Transactional
public class RDAssignmentDaoImpl implements RDAssignmentDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public RDAssignment getAssignmentById(int assignmentId) {
        return getCurrentSession().get(RDAssignment.class, assignmentId);
    }

    @SuppressWarnings("unchecked")
    @Override
    public List<RDAssignment> getAssignmentsByCourseSessionDetailId(int courseSessionDetailId) {
        return getCurrentSession()
                .createQuery("from RDAssignment where courseSessionDetail.courseSessionDetailId = :courseSessionDetailId")
                .setParameter("courseSessionDetailId", courseSessionDetailId)
                .list();
    }

    @Override
    public void saveAssignment(RDAssignment assignment) {
        getCurrentSession().save(assignment);
    }

    @Override
    public void updateAssignment(RDAssignment assignment) {
        getCurrentSession().update(assignment);
    }

    @Override
    public void deleteAssignment(int assignmentId) {
        RDAssignment assignment = getAssignmentById(assignmentId);
        if (assignment != null) {
            getCurrentSession().delete(assignment);
        }
    }

	@Override
	public List<RDAssignment> getAllAssignments() {
		
		Session session = getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDAssignment > cq = cb.createQuery(RDAssignment.class);
        Root < RDAssignment > root = cq.from(RDAssignment.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
	}
}
