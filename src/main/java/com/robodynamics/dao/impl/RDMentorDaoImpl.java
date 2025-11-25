// src/main/java/com/robodynamics/dao/impl/RDMentorDaoImpl.java
package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMentorDao;
import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.dto.RDMentorSearchCriteria;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMentor;
import com.robodynamics.model.RDUser;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Repository
@Transactional(readOnly = true)
public class RDMentorDaoImpl implements RDMentorDao {

    private final SessionFactory sessionFactory;

    public RDMentorDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() {
        return sessionFactory.getCurrentSession();
    }

    // ---------------------------------------------
    // BASIC QUERIES (UNCHANGED)
    // ---------------------------------------------

    @Override
    public RDMentor findMentorProfile(Integer mentorId) {

        String hql = """
            SELECT DISTINCT m FROM RDMentor m
            LEFT JOIN FETCH m.skills s
            LEFT JOIN FETCH m.feedbacks f
            LEFT JOIN FETCH m.recommendations r
            LEFT JOIN FETCH m.user u
            WHERE m.mentorId = :id
        """;

        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDMentor.class)
                .setParameter("id", mentorId)
                .uniqueResult();
    }

    
    @Override
    public List<RDMentorDTO> findAllMentorsBasic() {
        Session s = sessionFactory.getCurrentSession();

        String hql = """
          select new com.robodynamics.dto.RDMentorDTO(
              u.userID,
              concat(coalesce(u.firstName,''), 
                     case when u.lastName is null or u.lastName='' 
                          then '' else concat(' ', u.lastName) end),
              u.email,
              u.cellPhone,
              case when u.active = 1 then true else false end
          )
          from RDUser u
          where u.profile_id in (:mentorProfileIds)
          order by u.firstName asc, u.lastName asc
        """;

        List<Integer> profileIds = Arrays.asList(
                RDUser.profileType.SUPER_ADMIN.getValue(),
                RDUser.profileType.ROBO_ADMIN.getValue(),
                RDUser.profileType.ROBO_MENTOR.getValue()
        );

        return s.createQuery(hql, RDMentorDTO.class)
                .setParameterList("mentorProfileIds", profileIds)
                .list();
    }

    @Override
    public List<RDMentorDTO> findMentorsSummary() {
        Session s = sessionFactory.getCurrentSession();

        String hql = """
          select new com.robodynamics.dto.RDMentorDTO(
              u.userID,
              concat(coalesce(u.firstName,''), 
                     case when u.lastName is null or u.lastName='' 
                     then '' else concat(' ', u.lastName) end),
              u.email,
              u.cellPhone,
              case when u.active = 1 then true else false end,
              count(distinct o.courseOfferingId)
          )
          from RDUser u
            left join RDCourseOffering o on o.mentor.userID = u.userID
          where u.profile_id = :mentorProfileId
          group by u.userID, u.firstName, u.lastName, u.email, u.cellPhone, u.active
          order by u.firstName asc, u.lastName asc
        """;

        return s.createQuery(hql, RDMentorDTO.class)
                .setParameter("mentorProfileId", RDUser.profileType.ROBO_MENTOR.getValue())
                .list();
    }

    @Override
    public RDMentor findByUserId(int userId) {
        return s().createQuery(
                "from RDMentor m where m.user.userID = :uid", RDMentor.class)
                .setParameter("uid", userId)
                .uniqueResult();
    }

    @Override
    public void save(RDMentor mentor) {
        s().save(mentor);
    }

    @Override
    public void update(RDMentor mentor) {
        s().update(mentor);
    }

    @Override
    public List<RDMentorDTO> findFeaturedMentors() {
        return s().createQuery(
                "select new com.robodynamics.dto.RDMentorDTO(" +
                "  m.mentorId, m.fullName, m.city, m.experienceYears, " +
                "  m.linkedinUrl, m.isVerified) " +
                "from RDMentor m " +
                "where m.isActive = 1 " +
                "order by m.isVerified desc, m.updatedAt desc",
                RDMentorDTO.class)
                .setMaxResults(8)
                .list();
    }

    @Override
    public List<RDMentor> findMentorsForLead(RDLead lead) {
        int grade = Integer.parseInt(lead.getGrade().replaceAll("\\D", "0"));
        List<String> subjects = Arrays.asList("Math", "Science");

        String hql = """
            select distinct m
            from RDMentor m
            left join fetch m.skills s
            where :grade between s.gradeMin and s.gradeMax
            and s.skillLabel in (:subjects)
        """;

        return s().createQuery(hql, RDMentor.class)
                .setParameter("grade", grade)
                .setParameterList("subjects", subjects)
                .list();
    }

    @Override
    public RDMentor getMentorById(int mentorId) {
        return s().createQuery(
                "SELECT m FROM RDMentor m LEFT JOIN FETCH m.skills WHERE m.mentorId = :id",
                RDMentor.class)
                .setParameter("id", mentorId)
                .uniqueResult();
    }

    @Override
    public RDMentor getMentorWithSkills(int mentorId) {
        return s().createQuery(
                "SELECT m FROM RDMentor m LEFT JOIN FETCH m.skills WHERE m.mentorId = :id",
                RDMentor.class)
                .setParameter("id", mentorId)
                .uniqueResult();
    }

    @Override
    public boolean hasMentorProfile(int userID) {
        Long count = s().createQuery(
                "SELECT COUNT(m) FROM RDMentor m WHERE m.user.userID = :uid",
                Long.class)
                .setParameter("uid", userID)
                .uniqueResult();
        return count != null && count > 0;
    }
}
