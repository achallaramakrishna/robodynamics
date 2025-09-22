package com.robodynamics.service;

import com.robodynamics.model.RDSkill;
import com.robodynamics.model.RDLeadSkill;

public interface RDSkillService {
    RDSkill getOrCreateSkill(String subject);
    void saveLeadSkill(RDLeadSkill leadSkill);
}
