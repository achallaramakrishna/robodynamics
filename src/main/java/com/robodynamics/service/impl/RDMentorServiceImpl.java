// src/main/java/com/robodynamics/service/impl/RDMentorServiceImpl.java
package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMentorDao;
import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDMentor;
import com.robodynamics.model.RDMentorSkill;
import com.robodynamics.model.RDSkill;
import com.robodynamics.service.RDMentorService;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RDMentorServiceImpl implements RDMentorService {

    private final RDMentorDao mentorDao;
    private final SessionFactory sessionFactory;

    public RDMentorServiceImpl(RDMentorDao mentorDao,
                               SessionFactory sessionFactory) {
        this.mentorDao = mentorDao;
        this.sessionFactory = sessionFactory;
    }

    // ---------- READS ----------

    @Override
    @Transactional(readOnly = true)
    public List<RDMentorDTO> getAllMentors() {
        return mentorDao.findAllMentorsBasic();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMentorDTO> getMentorsWithSummary() {
        return mentorDao.findMentorsSummary();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMentorDTO> getFeaturedMentors() {
        // Make sure your DAO exposes this; example signature below
        return mentorDao.findFeaturedMentors();
    }

    // ---------- WRITES (mentor onboarding from lead) ----------

    /**
     * Create/Update rd_users (mentor profile), rd_mentors, and rd_mentor_skills
     * based on a mentor lead. Returns mentor_id.
     */
    @Override
    @Transactional
    public Integer upsertMentorFromLead(RDLead lead, List<RDSkill> rdSkills) {
        Session s = sessionFactory.getCurrentSession();

        // 1) Upsert rd_users as ROBO_MENTOR
        RDUser user = findUserByPhoneOrEmail(s, lead.getPhone(), lead.getEmail());
        if (user == null) {
            user = new RDUser();
            user.setFirstName(lead.getName());
            user.setCellPhone(lead.getPhone());
            user.setAge(25);
            user.setEmail(lead.getEmail());
            user.setActive(1);
            user.setProfile_id(RDUser.profileType.ROBO_MENTOR.getValue());
            user.setUserName("temp");
            user.setPassword("temp"); // TODO: replace with hashed password during onboarding
            s.save(user);
        } else {
            user.setActive(1);
            user.setProfile_id(RDUser.profileType.ROBO_MENTOR.getValue());
            s.update(user);
        }

        // 2) Upsert rd_mentors linked to this user
        Integer mentorId = s.createQuery(
                "select m.mentorId from RDMentor m where m.user.userID = :uid", Integer.class)
            .setParameter("uid", user.getUserID())
            .uniqueResult();
        if (mentorId == null) {
            RDMentor m = new RDMentor();
            m.setUser(user);
            m.setFullName(lead.getName());
            m.setEmail(nvl(lead.getEmail(), "pending+" + user.getUserID() + "@example.com"));
            m.setMobile(nvl(lead.getPhone(), "NA"));
            user.setAge(25);
            m.setIsActive(1);
            m.setIsVerified(0);
            s.save(m);
            mentorId = m.getMentorId();
        }

        // 3) Upsert mentor skills
        upsertMentorSkills(mentorId, rdSkills);

        return mentorId;
    }

    /**
     * Insert missing (mentor_id, skill_label) rows into rd_mentor_skills (schema doesn't FK to rd_skills).
     * Uses labels from canonical RDSkill rows. Idempotent via case-insensitive check.
     */
    @Override
    @Transactional
    public void upsertMentorSkills(Integer mentorId, List<RDSkill> rdSkills) {
        if (mentorId == null || rdSkills == null || rdSkills.isEmpty()) return;

        Session s = sessionFactory.getCurrentSession();

        // existing labels (lowercased)
        Set<String> existing = s.createQuery(
                "select lower(ms.skillLabel) from RDMentorSkill ms where ms.mentorId = :mid",
                String.class)
            .setParameter("mid", mentorId)
            .getResultStream()
            .collect(Collectors.toSet());

        for (RDSkill sk : rdSkills) {
            String label = sk.getSkillName();
            if (label == null || label.isBlank()) continue;

            String key = label.trim().toLowerCase();
            if (existing.contains(key)) continue;

            RDMentorSkill ms = new RDMentorSkill();
            ms.setMentorId(mentorId);
            ms.setSkillLabel(label.trim());
            ms.setSkillCode(toCode(label));   // e.g., "Math" -> "MATH"
            ms.setSkillLevel("beginner");
            s.save(ms);

            existing.add(key);
        }
    }

    // ---------- helpers ----------

    private RDUser findUserByPhoneOrEmail(Session s, String phone, String email) {
        if (phone != null && !phone.isEmpty()) {
            RDUser u = s.createQuery("from RDUser u where u.cellPhone = :p", RDUser.class)
                        .setParameter("p", phone)
                        .uniqueResult();
            if (u != null) return u;
        }
        if (email != null && !email.isEmpty()) {
            return s.createQuery("from RDUser u where u.email = :e", RDUser.class)
                    .setParameter("e", email)
                    .uniqueResult();
        }
        return null;
    }

    private String toCode(String label) {
        String t = label.trim().toUpperCase().replaceAll("[^A-Z0-9]+", "_");
        return t.length() > 40 ? t.substring(0, 40) : t;
    }

    private static String nvl(String v, String def) {
        return (v == null || v.isEmpty()) ? def : v;
    }
}
