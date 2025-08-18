package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDCourseAccessDao;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSessionDetail;

@Repository
public class RDCourseAccessDaoImpl implements RDCourseAccessDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session s() { return sessionFactory.getCurrentSession(); }

    @Override
    public List<RDCourse> findCoursesByParent(int parentUserId) {
        /*
         * Assumes relationships like:
         * RDStudentEnrollment e -> e.courseOffering o -> o.course c
         * and RDStudentEnrollment has a parent link/column (e.parentUserId) or a relation (e.parent.userID).
         *
         * If your model differs, adjust where clause accordingly.
         */
        String hql =
            "select distinct c " +
            "from RDStudentEnrollment e " +
            "join e.courseOffering o " +
            "join o.course c " +
            "where e.parent.userID = :uid " +
            "order by c.courseName asc";

        return s().createQuery(hql, RDCourse.class)
                  .setParameter("uid", parentUserId)
                  .getResultList();
    }

    @Override
    public boolean isCourseVisibleToParent(Integer courseId, Integer parentUserId) {
        String hql =
            "select count(c.courseId) " +
            "from RDStudentEnrollment e " +
            "join e.courseOffering o " +
            "join o.course c " +
            "where e.parent.userID = :uid and c.courseId = :cid";

        Long cnt = s().createQuery(hql, Long.class)
                      .setParameter("uid", parentUserId)
                      .setParameter("cid", courseId)
                      .uniqueResult();
        return cnt != null && cnt > 0;
    }

    @Override
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public List<?> findChapterDetailsByCourse(Integer courseId) {
        /*
         * Returns the session-detail rows (chapters) for a given course.
         * You can switch to a projection (id, name) by replacing the select clause and return List<Object[]>.
         *
         * Examples:
         *   Full entities:
         *     select d from RDCourseSessionDetail d
         *     join d.courseSession s
         *     where s.course.courseId = :cid
         *     order by s.courseSessionId asc, d.courseSessionDetailId asc
         *
         *   Lightweight projection:
         *     select d.courseSessionDetailId, d.topic from RDCourseSessionDetail d
         *     join d.courseSession s
         *     where s.course.courseId = :cid
         *     order by s.courseSessionId asc, d.courseSessionDetailId asc
         */
        String hql =
            "select d " +
            "from RDCourseSessionDetail d " +
            "join d.courseSession s " +
            "where s.course.courseId = :cid " +
            "order by s.courseSessionId asc, d.courseSessionDetailId asc";

        List<RDCourseSessionDetail> rows =
            s().createQuery(hql, RDCourseSessionDetail.class)
               .setParameter("cid", courseId)
               .getResultList();

        // method signature is List<?> to allow either entities or projections
        return (List) rows;
    }
}
