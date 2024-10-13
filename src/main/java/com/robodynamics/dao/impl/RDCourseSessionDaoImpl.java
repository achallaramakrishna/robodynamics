package com.robodynamics.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCourseSessionDao;
import com.robodynamics.model.RDCourseSession;

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
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDCourseSession> cq = cb.createQuery(RDCourseSession.class);
        Root<RDCourseSession> root = cq.from(RDCourseSession.class);
        cq.select(root);
        Query<RDCourseSession> query = session.createQuery(cq);
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
        RDCourseSession courseSession = session.byId(RDCourseSession.class).load(courseSessionId);
        session.delete(courseSession);
    }

    @Override
    public void saveAll(List<RDCourseSession> courseSessions) {
        Session session = factory.getCurrentSession();
        for (RDCourseSession courseSession : courseSessions) {
        	System.out.println("Step 31.....");
            session.saveOrUpdate(courseSession);  // Save or update each session in the list
        }
    }
    
    public RDCourseSession getCourseSessionBySessionIdAndCourseId(int sessionId, int courseId) {
        Session session = factory.getCurrentSession();

        // Native SQL query that fetches RDCourseSession based on courseSessionId and courseId,
        // only if the courseSessionId exists in the rd_course_session_details table
        String sql = "SELECT cs.* " +
                     "FROM rd_course_sessions cs " +
                     "WHERE cs.session_id = :sessionId " +
                     "AND cs.course_id = :courseId " +
                     "LIMIT 1";

        Query<RDCourseSession> query = session.createNativeQuery(sql, RDCourseSession.class);
        query.setParameter("sessionId", sessionId);
        query.setParameter("courseId", courseId);

        return query.uniqueResult();    
    }




}
