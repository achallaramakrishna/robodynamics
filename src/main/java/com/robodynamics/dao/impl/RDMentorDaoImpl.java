// src/main/java/com/robodynamics/dao/impl/RDMentorDaoImpl.java
package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMentorDao;
import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.model.RDUser;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Repository
@Transactional(readOnly = true)
public class RDMentorDaoImpl implements RDMentorDao {

    private final SessionFactory sessionFactory;

    public RDMentorDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public List<RDMentorDTO> findAllMentorsBasic() {
        Session s = sessionFactory.getCurrentSession();
        final int MENTOR_PROFILE_ID = com.robodynamics.model.RDUser.profileType.ROBO_MENTOR.getValue();

        String hql = """
          select new com.robodynamics.dto.RDMentorDTO(
              u.userID,
              concat(coalesce(u.firstName,''), case when u.lastName is null or u.lastName='' then '' else concat(' ', u.lastName) end),
              u.email,
              u.cellPhone,
              case when u.active = 1 then true else false end
          )
          from com.robodynamics.model.RDUser u
        		where u.profile_id in (:mentorProfileIds)
          order by u.firstName asc, u.lastName asc
        """;

        List<Integer> mentorProfileIds = Arrays.asList(
        	    RDUser.profileType.SUPER_ADMIN.getValue(),
        	    RDUser.profileType.ROBO_ADMIN.getValue(),
        	    RDUser.profileType.ROBO_MENTOR.getValue()
        	);

        	return s.createQuery(hql, RDMentorDTO.class)
        	        .setParameterList("mentorProfileIds", mentorProfileIds)
        	        .list();

          }

    @Override
    public List<RDMentorDTO> findMentorsSummary() {
        Session s = sessionFactory.getCurrentSession();
        final int MENTOR_PROFILE_ID = com.robodynamics.model.RDUser.profileType.ROBO_MENTOR.getValue();

        String hql = """
          select new com.robodynamics.dto.RDMentorDTO(
              u.userID,
              concat(coalesce(u.firstName,''), case when u.lastName is null or u.lastName='' then '' else concat(' ', u.lastName) end),
              u.email,
              u.cellPhone,
              case when u.active = 1 then true else false end,
              count(distinct o.courseOfferingId)
          )
          from com.robodynamics.model.RDUser u
            left join com.robodynamics.model.RDCourseOffering o
                   on o.mentor.userID = u.userID
                   -- If you store mentor as int, use:
                   -- on o.mentorId = u.userID
          where u.profile_id = :mentorProfileId
          group by u.userID, u.firstName, u.lastName, u.email, u.cellPhone, u.active
          order by u.firstName asc, u.lastName asc
        """;

        return s.createQuery(hql, RDMentorDTO.class)
                .setParameter("mentorProfileId", MENTOR_PROFILE_ID)
                .list();
    }
}
