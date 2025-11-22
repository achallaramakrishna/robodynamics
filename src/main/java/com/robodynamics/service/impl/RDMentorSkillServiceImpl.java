package com.robodynamics.service.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dto.SkillDTO;
import com.robodynamics.model.RDMentorSkill;
import com.robodynamics.service.RDMentorSkillService;

@Service
@Transactional(readOnly = true)
public class RDMentorSkillServiceImpl implements RDMentorSkillService {

    private final SessionFactory sessionFactory;

    public RDMentorSkillServiceImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() {
        return sessionFactory.getCurrentSession();
    }

    /**
     * Fetch all mentor skills with ordering by skill label.
     */
    @Override
    public List<RDMentorSkill> getAllSkills() {
        String hql = "FROM RDMentorSkill s ORDER BY s.skillLabel ASC";
        Query<RDMentorSkill> q = s().createQuery(hql, RDMentorSkill.class);
        return q.getResultList();
    }
    
    @Override
    public List<SkillDTO> findAllDistinctSkills() {
        return sessionFactory.getCurrentSession()
            .createQuery(
                "SELECT DISTINCT new com.robodynamics.dto.SkillDTO(s.skillCode, s.skillLabel) " +
                "FROM RDMentorSkill s ORDER BY s.skillLabel",
                SkillDTO.class
            )
            .list();
    }


    /**
     * Fetch distinct skill codes.
     */
    @Override
    public List<String> getAllSkillCodes() {
        String hql = "SELECT DISTINCT s.skillCode FROM RDMentorSkill s ORDER BY s.skillCode ASC";
        Query<String> q = s().createQuery(hql, String.class);
        return q.getResultList();
    }

    /**
     * Fetch all skills for a particular mentor.
     */
    @Override
    public List<RDMentorSkill> getSkillsForMentor(Integer mentorId) {
        String hql = "FROM RDMentorSkill s WHERE s.mentorId = :mentorId ORDER BY s.skillLabel ASC";
        Query<RDMentorSkill> q = s().createQuery(hql, RDMentorSkill.class);
        q.setParameter("mentorId", mentorId);
        return q.getResultList();
    }

	
}
