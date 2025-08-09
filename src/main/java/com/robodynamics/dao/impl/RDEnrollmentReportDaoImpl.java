package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDEnrollmentReportDao;
import com.robodynamics.dto.RDEnrollmentReportDTO;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import org.hibernate.query.Query;


import java.util.List;


@Repository
@Transactional(readOnly = true)
public class RDEnrollmentReportDaoImpl implements RDEnrollmentReportDao {

    private final SessionFactory sessionFactory;

    public RDEnrollmentReportDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    
    @Override
    public List<RDEnrollmentReportDTO> getEnrollmentReport(Integer offeringId) {
        Session session = sessionFactory.getCurrentSession();

        String hql = """
            select new com.robodynamics.dto.RDEnrollmentReportDTO(
                e.enrollmentId,
                concat(coalesce(s.firstName,''), 
                       case when s.lastName is null or s.lastName='' 
                            then '' else concat(' ', s.lastName) end),
                s.grade,
                concat(coalesce(p.firstName,''), 
                       case when p.lastName is null or p.lastName='' 
                            then '' else concat(' ', p.lastName) end),
                coalesce(p.cellPhone, p.email),
                e.enrollmentDate
            )
            from com.robodynamics.model.RDStudentEnrollment e
              join e.courseOffering o
              join e.student s
              join e.parent p
            where (:offeringId is null or o.courseOfferingId = :offeringId)
            order by o.startDate desc, s.firstName asc, s.lastName asc
        """;

        Query<RDEnrollmentReportDTO> q = session.createQuery(hql, RDEnrollmentReportDTO.class);
        q.setParameter("offeringId", offeringId); // null => all
        
        List list = q.getResultList();
        System.out.println("List - " + list);
        
        return list;
    }

}
