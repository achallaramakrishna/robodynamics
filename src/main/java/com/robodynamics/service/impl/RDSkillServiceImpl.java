package com.robodynamics.service.impl;

import com.robodynamics.dao.RDSkillDao;
import com.robodynamics.dao.RDLeadSkillDao;
import com.robodynamics.model.RDSkill;
import com.robodynamics.model.RDLeadSkill;
import com.robodynamics.service.RDSkillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RDSkillServiceImpl implements RDSkillService {

    @Autowired
    private RDSkillDao skillDao;

    @Autowired
    private RDLeadSkillDao leadSkillDao;

    @Override
    @Transactional
    public RDSkill getOrCreateSkill(String subject) {
        RDSkill skill = skillDao.findBySkillName(subject);
        if (skill == null) {
            skill = new RDSkill();
            skill.setSkillName(subject);
            skillDao.save(skill);
        }
        return skill;
    }

    @Override
    @Transactional
    public void saveLeadSkill(RDLeadSkill leadSkill) {
        leadSkillDao.save(leadSkill);
    }
}
