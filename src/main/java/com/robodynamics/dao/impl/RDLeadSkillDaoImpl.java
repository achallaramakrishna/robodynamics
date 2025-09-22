package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDLeadSkillDao;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDLeadSkill;
import com.robodynamics.model.RDSkill;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class RDLeadSkillDaoImpl implements RDLeadSkillDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    @Transactional
    public void save(RDLeadSkill leadSkill) {
        sessionFactory.getCurrentSession().saveOrUpdate(leadSkill);
    }

    @Override
    @Transactional
    public void addLeadSkillsIfMissing(Long leadId, java.util.List<Long> skillIds) {
        if (leadId == null || skillIds == null || skillIds.isEmpty()) return;

        // 1) De-duplicate and drop nulls
        java.util.Set<Long> requested = new java.util.LinkedHashSet<>();
        for (Long sid : skillIds) if (sid != null) requested.add(sid);
        if (requested.isEmpty()) return;

        Session s = sessionFactory.getCurrentSession();

        // 2) Find which skills already attached to this lead (single round-trip)
        Query<Long> q = s.createQuery(
            "select ls.skill.skillId " +
            "from RDLeadSkill ls " +
            "where ls.lead.id = :leadId and ls.skill.skillId in (:ids)",
            Long.class
        );
        q.setParameter("leadId", leadId);
        q.setParameterList("ids", requested);
        java.util.List<Long> existing = q.getResultList();
        requested.removeAll(new java.util.HashSet<>(existing)); // only new ones remain
        if (requested.isEmpty()) return;

        // 3) Get refs once
        RDLead leadRef  = s.getReference(RDLead.class, leadId);

        int i = 0;
        for (Long sid : requested) {
            RDSkill skillRef = s.getReference(RDSkill.class, sid);

            // === If you use COMPOSITE KEY with @EmbeddedId and ctor sets it ===
            RDLeadSkill link = new RDLeadSkill(leadRef, skillRef);
            // === If you use SURROGATE PK (Long id) instead, do:
            // RDLeadSkill link = new RDLeadSkill();
            // link.setLead(leadRef);
            // link.setSkill(skillRef);

            s.save(link);

            // optional batching
            if (++i % 50 == 0) {
                s.flush();
                s.clear();
            }
        }
    }


	
}
