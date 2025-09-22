package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDLeadSkill;

public interface RDLeadSkillDao {
    void save(RDLeadSkill leadSkill);

	void addLeadSkillsIfMissing(Long id, List<Long> skillIds);
}
