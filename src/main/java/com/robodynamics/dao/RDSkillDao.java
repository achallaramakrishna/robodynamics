package com.robodynamics.dao;

import com.robodynamics.model.RDSkill;

public interface RDSkillDao {
    RDSkill findBySkillName(String skillName);
    void save(RDSkill skill);
}
