package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDLeadSkill;

public interface RDLeadSkillService {
    void saveLeadSkill(RDLeadSkill leadSkill);

	void addLeadSkillsIfMissing(Long id, List<Long> skillIds);
}
