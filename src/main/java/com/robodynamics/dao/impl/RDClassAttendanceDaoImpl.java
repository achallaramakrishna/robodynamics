package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDClassAttendanceDao;
import com.robodynamics.model.RDClassAttendance;
import com.robodynamics.model.RDCourseOffering;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@Transactional
public class RDClassAttendanceDaoImpl implements RDClassAttendanceDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void saveAttendance(RDClassAttendance attendance) {
        sessionFactory.getCurrentSession().saveOrUpdate(attendance);
    }

    @Override
    public RDClassAttendance findBySessionStudentAndDate(int sessionId, int studentId, Date date) {
        String hql = "FROM RDClassAttendance att " +
                     "WHERE att.classSession.classSessionId = :sessionId " +
                     "AND att.student.userID = :studentId " +
                     "AND att.attendanceDate = :date";
        Query<RDClassAttendance> query = sessionFactory.getCurrentSession().createQuery(hql, RDClassAttendance.class);
        query.setParameter("sessionId", sessionId);
        query.setParameter("studentId", studentId);
        query.setParameter("date", date);
        return query.uniqueResult();
    }

    @Override
    public List<RDClassAttendance> findBySession(int sessionId) {
        String hql = "FROM RDClassAttendance att WHERE att.classSession.classSessionId = :sessionId";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDClassAttendance.class)
                .setParameter("sessionId", sessionId)
                .list();
    }

    @Override
    public List<RDClassAttendance> findByStudent(int studentId) {
        String hql = "FROM RDClassAttendance att WHERE att.student.userID = :studentId";
        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDClassAttendance.class)
                .setParameter("studentId", studentId)
                .list();
    }
    @Override
    public String getAttendanceStatus(int userId, int offeringId, LocalDate sessionDate) {
    	 String hql = "SELECT a.status FROM RDClassAttendance a "
                 + "WHERE a.student.userID = :userId "
                 + "AND a.courseOffering.courseOfferingId = :offeringId "
                 + "AND a.classSession.sessionDate = :sessionDate";
      return sessionFactory.getCurrentSession()
                    .createQuery(hql, String.class)
                    .setParameter("userId", userId)
                    .setParameter("offeringId", offeringId)
                    .setParameter("sessionDate", sessionDate)
                    .uniqueResult();
    }

	@Override
	public RDClassAttendance getAttendanceById(int id) {
		Session session = sessionFactory.getCurrentSession();
		RDClassAttendance classAttendance = session.get(RDClassAttendance.class, id);
		return classAttendance;
	}

	@Override
	public boolean existsByOfferingAndUserAndDate(int offeringId, int userId, LocalDate date) {
	    String hql = "SELECT COUNT(a) FROM RDClassAttendance a " +
	                 "WHERE a.classSession.courseOffering.courseOfferingId = :offeringId " +
	                 "AND a.student.userID = :userId " +
	                 "AND a.classSession.sessionDate = :sessionDate";

	    Long count = sessionFactory.getCurrentSession()
	                        .createQuery(hql, Long.class)
	                        .setParameter("offeringId", offeringId)
	                        .setParameter("userId", userId)
	                        .setParameter("sessionDate", date)
	                        .uniqueResult();

	    return count != null && count > 0;
	}

	@Override
	public Object saveOrUpdateAttendance(int offeringId, int userId, Integer sessionId, int classSessionId,
			String attendanceStatus, LocalDate today) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public RDClassAttendance findByOfferingStudentAndDate(int offeringId, int studentId, LocalDate date) {
		String hql = "FROM RDClassAttendance a " +
                "WHERE a.classSession.courseOffering.courseOfferingId = :offeringId " +
                "AND a.student.userID = :studentId " +
                "AND a.attendanceDate = :date";

   return sessionFactory.getCurrentSession()
           .createQuery(hql, RDClassAttendance.class)
           .setParameter("offeringId", offeringId)
           .setParameter("studentId", studentId)
           .setParameter("date", java.sql.Date.valueOf(date))
           .uniqueResult();
	}

	@Override
	public List<RDClassAttendance> getAttendanceByEnrollment(int enrollmentId) {
		  final String hql =
			        "select a " +
			        "from RDClassAttendance a " +
			        "  left join fetch a.classSession cs " +
			        "  left join fetch cs.courseOffering co " +
			        "  left join fetch a.enrollment e " +
			        "  left join fetch e.student s " +
			        "  left join fetch a.student asd " +
			        "where e.enrollmentId = :enrId " +
			        "order by coalesce(cs.sessionDate, a.attendanceDate) asc";

			    Session session = sessionFactory.getCurrentSession();
			    return session.createQuery(hql, RDClassAttendance.class)
			                  .setParameter("enrId", enrollmentId)
			                  .getResultList();
	}

	// In attendanceDao
	@SuppressWarnings("unchecked")
	public Map<Integer, Integer> findStatusForSessionByEnrollment(Integer classSessionId) {
	    String hql = """
	        select a.enrollment.enrollmentId, a.attendanceStatus
	        from RDClassAttendance a
	        where a.classSession.classSessionId = :sid
	    """;

	    List<Object[]> rows = sessionFactory.getCurrentSession()
	            .createQuery(hql)
	            .setParameter("sid", classSessionId)
	            .list();

	    Map<Integer, Integer> map = new HashMap<>();
	    for (Object[] r : rows) {
	        map.put((Integer) r[0], (Integer) r[1]); // enrollmentId -> 1/2
	    }
	    return map;
	}

	@Override
    public boolean wasPresentInRange(int offeringId, int studentUserId, LocalDate from, LocalDate to) {
        Session session = sessionFactory.getCurrentSession();

        Long count = session.createQuery(
            "select count(a) " +
            "from RDClassAttendance a " +
            " join a.enrollment e " +
            " join e.courseOffering co " +
            " join a.student stu " +
            "where co.courseOfferingId = :offeringId " +
            "  and stu.userID = :studentUserId " +
            "  and a.attendanceDate between :from and :to " +
            "  and lower(a.attendanceStatus) = 'present'",
            Long.class)
            .setParameter("offeringId", offeringId)
            .setParameter("studentUserId", studentUserId)
            .setParameter("from", from)
            .setParameter("to", to)
            .uniqueResult();

        return count != null && count > 0;
    }


	
	
	

}
