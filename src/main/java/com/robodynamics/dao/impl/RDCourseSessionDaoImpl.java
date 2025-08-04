package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDCourseSessionDao;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSession.TierLevel;

import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Repository
@Transactional
public class RDCourseSessionDaoImpl implements RDCourseSessionDao {

    @Autowired
    private SessionFactory factory;

    @Override
    public void saveRDCourseSession(RDCourseSession courseSession) {
        Session session = factory.getCurrentSession();
        session.saveOrUpdate(courseSession);
    }

    @Override
    public RDCourseSession getRDCourseSession(int courseSessionId) {
        Session session = factory.getCurrentSession();
        RDCourseSession courseSession = session.get(RDCourseSession.class, courseSessionId);
        return courseSession;
    }

    @Override
    public List<RDCourseSession> getRDCourseSessions() {
        Session session = factory.getCurrentSession();
        String hql = "FROM RDCourseSession";
        Query<RDCourseSession> query = session.createQuery(hql, RDCourseSession.class);
        return query.getResultList();
    }

    @Override
    public List<RDCourseSession> getCourseSessionsByCourseId(int courseId) {
        Session session = factory.getCurrentSession();
        String hql = "FROM RDCourseSession WHERE course.courseId = :courseId";
        Query<RDCourseSession> query = session.createQuery(hql, RDCourseSession.class);
        query.setParameter("courseId", courseId);
        return query.getResultList();
    }

    @Override
    public void deleteRDCourseSession(int courseSessionId) {
        Session session = factory.getCurrentSession();
        RDCourseSession courseSession = session.get(RDCourseSession.class, courseSessionId);
        if (courseSession != null) {
            session.delete(courseSession);
        }
    }

    @Override
    public void saveAll(List<RDCourseSession> courseSessions) {
        Session session = factory.getCurrentSession();
        for (RDCourseSession courseSession : courseSessions) {
            session.saveOrUpdate(courseSession);
        }
    }

    @Override
    public RDCourseSession getCourseSessionBySessionIdAndCourseId(int sessionId, int courseId) {
        Session session = factory.getCurrentSession();
        String hql = "FROM RDCourseSession cs WHERE cs.sessionId = :sessionId AND cs.course.courseId = :courseId";
        Query<RDCourseSession> query = session.createQuery(hql, RDCourseSession.class);
        query.setParameter("sessionId", sessionId);
        query.setParameter("courseId", courseId);
        return query.uniqueResult();
    }

    // **Implementation of New Methods**

    @Override
    public List<RDCourseSession> getUnitsByCourseId(int courseId) {
        Session session = factory.getCurrentSession();
        String hql = "FROM RDCourseSession WHERE course.courseId = :courseId AND parentSession IS NULL";
        Query<RDCourseSession> query = session.createQuery(hql, RDCourseSession.class);
        query.setParameter("courseId", courseId);
        return query.getResultList();
    }

    @Override
    public List<RDCourseSession> getSessionsByUnitId(int unitId) {
        Session session = factory.getCurrentSession();
        String hql = "FROM RDCourseSession WHERE parentSession.courseSessionId = :unitId";
        Query<RDCourseSession> query = session.createQuery(hql, RDCourseSession.class);
        query.setParameter("unitId", unitId);
        return query.getResultList();
    }

    @Override
    public List<RDCourseSession> getCourseHierarchyByCourseId(int courseId) {
        Session session = factory.getCurrentSession();
        String hql = "SELECT DISTINCT unit FROM RDCourseSession unit " +
                     "LEFT JOIN FETCH unit.childSessions " +
                     "WHERE unit.course.courseId = :courseId AND unit.parentSession IS NULL";
        Query<RDCourseSession> query = session.createQuery(hql, RDCourseSession.class);
        query.setParameter("courseId", courseId);
        return query.getResultList();
    }

	@Override
	@Transactional(readOnly = true)
	public List<RDCourseSession> findByCourseIdAndTierLevelOrderByTierOrder(int courseId, String tierLevel) {

		var session = factory.getCurrentSession();
        String hql = "FROM RDCourseSession WHERE course.id = :courseId AND tierLevel = :tierLevel ORDER BY tierOrder";
        Query<RDCourseSession> query = session.createQuery(hql, RDCourseSession.class);
        query.setParameter("courseId", courseId);
        query.setParameter("tierLevel", tierLevel);
        return query.list();
	}

	@Override
	public List<RDCourseSession> findByTierLevel(TierLevel tierLevel) {
		return factory.getCurrentSession()
                .createQuery("FROM RDCourseSession WHERE tierLevel = :tierLevel")
                .setParameter("tierLevel", tierLevel)
                .list();
	}

	@Override
	public List<RDCourseSession> findByTierLevelOrderedByTierOrder(TierLevel tierLevel) {
		return factory.getCurrentSession()
                .createQuery("FROM RDCourseSession WHERE tierLevel = :tierLevel ORDER BY tierOrder ASC")
                .setParameter("tierLevel", tierLevel)
                .list();
	}

	@Override
	public List<RDCourseSession> getCourseSessionsByCourseOfferingId(int courseOfferingId) {
		 Session session = factory.getCurrentSession();

		    // Fetch CourseOffering
		    RDCourseOffering offering = session.get(RDCourseOffering.class, courseOfferingId);
		    if (offering == null || offering.getCourse() == null) {
		        return Collections.emptyList();
		    }

		    int courseId = offering.getCourse().getCourseId();

		    // Fetch Sessions using Course ID
		    String hql = "FROM RDCourseSession cs WHERE cs.course.courseId = :courseId ORDER BY cs.tierOrder ASC";
		    Query<RDCourseSession> query = session.createQuery(hql, RDCourseSession.class);
		    query.setParameter("courseId", courseId);

		    return query.getResultList();
	}


}
