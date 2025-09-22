package com.robodynamics.service.impl;

import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMentor;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDSkill;
import com.robodynamics.model.RDMentorAssignment;
import com.robodynamics.model.RDMentorAssignment.Status;
import com.robodynamics.service.RDLeadMentorService;
import com.robodynamics.service.RDMentorService;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import javax.transaction.Transactional;

@Service
public class RDLeadMentorServiceImpl implements RDLeadMentorService {

    @Autowired
    private SessionFactory sessionFactory;
    
    @Autowired
    private RDMentorService mentorService;

    @Override
    @Transactional
    public void assignLeadToMentors(RDLead lead) {
        final Session s = sessionFactory.getCurrentSession();
        if (lead == null || lead.getId() == null) {
            System.out.println("[LMA] lead is null or has no id");
            return;
        }

        System.out.println("[LMA] leadId=" + lead.getId());

        // 1) Load skills for this lead
        List<RDSkill> skills = s.createQuery(
                "select ls.skill from RDLeadSkill ls where ls.lead.id = :leadId",
                RDSkill.class
            )
            .setParameter("leadId", lead.getId())
            .getResultList();

        System.out.println("[LMA] skills found = " + (skills == null ? 0 : skills.size()));
        if (skills == null || skills.isEmpty()) {
            System.out.println("[LMA] no skills linked to lead " + lead.getId() + " (check rd_lead_skills)");
            return;
        }
        for (RDSkill sk : skills) {
            System.out.println("[LMA] skill in loop: id=" + sk.getSkillId() + ", name=" + sk.getSkillName());
        }

        // 2) For each skill -> find up to 2 mentors (by user_id)
        for (RDSkill skill : skills) {
            if (skill == null || skill.getSkillId() == null) continue;

            try {
                // keep native result tiny & safe: return user_id only
                final String sql =
                    "SELECT u.user_id " +
                    "FROM rd_users u " +
                    "JOIN rd_mentors m      ON m.user_id = u.user_id " +
                    "JOIN rd_mentor_skills ms ON ms.mentor_id = m.mentor_id " +
                    "JOIN rd_skills s       ON UPPER(ms.skill_label) = UPPER(s.skill_name) " +
                    "WHERE s.skill_id = :sid AND u.profile_id = 3 AND u.active = 1 " +
                    "ORDER BY m.is_verified DESC, COALESCE(m.experience_years,0) DESC, m.mentor_id ASC " +
                    "LIMIT 2";

                @SuppressWarnings("unchecked")
                List<Number> mentorUserIds = s.createNativeQuery(sql)
                        .setParameter("sid", skill.getSkillId())
                        .getResultList();

                System.out.println("[LMA] skill=" + skill.getSkillName() +
                    " (" + skill.getSkillId() + "), mentorsFound=" + mentorUserIds.size());

                for (Number uidNum : mentorUserIds) {
                    Integer mentorUserId = (uidNum == null) ? null : uidNum.intValue();
                    if (mentorUserId == null) continue;

                    RDUser mentor = s.get(RDUser.class, mentorUserId);
                    if (mentor == null) {
                        System.out.println("[LMA] WARN: user_id " + mentorUserId + " not found in RDUser");
                        continue;
                    }

                    Long exists = s.createQuery(
                            "select count(*) from RDMentorAssignment a " +
                            "where a.lead.id = :leadId and a.mentor.userID = :mentorId and a.skill.skillId = :skillId",
                            Long.class)
                        .setParameter("leadId", lead.getId())
                        .setParameter("mentorId", mentor.getUserID())
                        .setParameter("skillId", skill.getSkillId())
                        .uniqueResult();

                    if (exists == null || exists == 0L) {
                        RDMentorAssignment a = new RDMentorAssignment();
                        a.setLead(lead);
                        a.setMentor(mentor);
                        a.setSkill(skill);
                        a.setDemoMentor(false);
                        a.setStatus(Status.PENDING);
                        s.save(a);
                        System.out.println("[LMA] assigned mentor userId=" + mentor.getUserID());
                    } else {
                        System.out.println("[LMA] already assigned mentor userId=" + mentor.getUserID());
                    }
                }
            } catch (Exception e) {
                System.out.println("[LMA] ERROR while matching skillId=" + skill.getSkillId() +
                                   " name=" + skill.getSkillName() + " → " + e.getClass().getName() +
                                   ": " + e.getMessage());
                e.printStackTrace(System.out); // ensure you see it in Console
            }
        }
    }


    @Override
	@Transactional
    public List<RDUser> getMentorsForLead(Long leadId) {
        try (Session session = sessionFactory.openSession()) {
            Query<RDUser> query = session.createQuery(
                "select a.mentor from RDMentorAssignment a where a.lead.id = :leadId", RDUser.class
            );
            query.setParameter("leadId", leadId);
            return query.list();
        }
    }

    @Override
	@Transactional
    public void claimLead(Long leadId, Long mentorId, Long skillId) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            Query<RDMentorAssignment> query = session.createQuery(
                "from RDMentorAssignment where lead.id = :leadId and mentor.id = :mentorId and skill.id = :skillId",
                RDMentorAssignment.class
            );
            query.setParameter("leadId", leadId);
            query.setParameter("mentorId", mentorId);
            query.setParameter("skillId", skillId);
            RDMentorAssignment assignment = query.uniqueResult();
            if (assignment != null) {
                assignment.setStatus(Status.PENDING);
                session.update(assignment);
            }
            tx.commit();
        }
    }

    @Override
	@Transactional
    public void proposeDemoDate(Long leadId, Long mentorId, Long skillId, LocalDateTime newDateTime) {
        try (Session session = sessionFactory.openSession()) {
            Transaction tx = session.beginTransaction();
            Query<RDMentorAssignment> query = session.createQuery(
                "from RDMentorAssignment where lead.id = :leadId and mentor.id = :mentorId and skill.id = :skillId",
                RDMentorAssignment.class
            );
            query.setParameter("leadId", leadId);
            query.setParameter("mentorId", mentorId);
            query.setParameter("skillId", skillId);
            RDMentorAssignment assignment = query.uniqueResult();
            if (assignment != null) {
                assignment.setStatus(Status.SCHEDULED);
                assignment.setProposedDemoDate(newDateTime);
                session.update(assignment);
            }
            tx.commit();
        }
    }

	@Override
	@Transactional
	public List<RDMentorAssignment> getAssignmentsForLead(Long leadId) {
	    String hql = "select distinct a\r\n"
	    		+ "  from RDMentorAssignment a\r\n"
	    		+ "  join fetch a.mentor m\r\n"
	    		+ "  join fetch a.skill  s\r\n"
	    		+ "  where a.lead.id = :leadId";
	    return sessionFactory.getCurrentSession()
	                         .createQuery(hql, RDMentorAssignment.class)
	                         .setParameter("leadId", leadId)
	                         .getResultList();
	}

	@Override
	@Transactional
	public List<RDLead> getLeadsForMentor(Integer mentorId) {
		Session session = sessionFactory.getCurrentSession();

        String hql = "select distinct a.lead from RDMentorAssignment a "
                   + "where a.mentor.userID = :mentorId "
                   + "order by a.lead.createdAt desc";

        Query<RDLead> query = session.createQuery(hql, RDLead.class);
        query.setParameter("mentorId", mentorId);

        return query.getResultList();
	}

}
