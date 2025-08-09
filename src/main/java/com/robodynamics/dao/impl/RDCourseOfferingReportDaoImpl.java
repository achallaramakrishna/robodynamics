package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDCourseOfferingReportDao;
import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional(readOnly = true)
public class RDCourseOfferingReportDaoImpl implements RDCourseOfferingReportDao {

    private final SessionFactory sessionFactory;

    public RDCourseOfferingReportDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

     @Override
        public List<RDCourseOfferingSummaryDTO> getOfferingSummaries(Integer courseId, Integer mentorId) {
            Session session = sessionFactory.getCurrentSession();

            String hql = """
                select new com.robodynamics.dto.RDCourseOfferingSummaryDTO(
                    c.courseId, c.courseName,
                    o.courseOfferingId, o.courseOfferingName,
                    trim(concat(coalesce(m.firstName, ''), ' ', coalesce(m.lastName, ''))),
                    o.startDate, o.endDate, coalesce(o.status, ''),
                    count(distinct e.enrollmentId)
                )
                from RDCourseOffering o
                    join o.course c
                    left join o.instructor m
                    left join o.studentEnrollments e
                where (:courseId is null or c.courseId = :courseId)
                  and (:mentorId is null or m.userID = :mentorId)
                group by c.courseId, c.courseName,
                         o.courseOfferingId, o.courseOfferingName,
                         m.firstName, m.lastName,
                         o.startDate, o.endDate, o.status
                order by o.startDate desc
            """;

            return session.createQuery(hql, RDCourseOfferingSummaryDTO.class)
                    .setParameter("courseId", courseId)
                    .setParameter("mentorId", mentorId)
                    .list();
        }



    @Override
    public List<Object[]> getOfferingsByCourseRaw(int courseId) {
        Session session = sessionFactory.getCurrentSession();

        String hql = """
            select o.courseOfferingId, o.courseOfferingName
            from RDCourseOffering o
            where o.course.courseId = :courseId
            order by o.startDate desc
        """;

        return session.createQuery(hql, Object[].class)
                .setParameter("courseId", courseId)
                .list();
    }
}
