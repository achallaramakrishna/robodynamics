package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDClassAttendanceDao;
import com.robodynamics.model.RDClassAttendance;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;

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
    public String getAttendanceStatus(int userId, int offeringId, Date today) {
        String hql = "SELECT CASE " +
                     "WHEN a.attendanceStatus = 1 THEN 'Present' " +
                     "WHEN a.attendanceStatus = 0 THEN 'Absent' " +
                     "ELSE 'Not Marked' END " +
                     "FROM RDClassAttendance a " +
                     "JOIN a.classSession cs " +
                     "JOIN a.enrollment e " +
                     "WHERE e.student.userID = :userId " +
                     "AND cs.courseOffering.courseOfferingId = :offeringId " +
                     "AND a.attendanceDate = :date";

        return sessionFactory.getCurrentSession()
                .createQuery(hql, String.class)
                .setParameter("userId", userId)
                .setParameter("offeringId", offeringId)
                .setParameter("date", today)
                .uniqueResultOptional()
                .orElse("Not Marked");
    }

}
