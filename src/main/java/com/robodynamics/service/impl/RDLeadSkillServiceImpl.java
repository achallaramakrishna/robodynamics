package com.robodynamics.service.impl;

import com.robodynamics.dao.RDLeadSkillDao;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDLeadSkill;
import com.robodynamics.model.RDSkill;
import com.robodynamics.service.RDLeadSkillService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RDLeadSkillServiceImpl implements RDLeadSkillService {

    @Autowired
    private RDLeadSkillDao leadSkillDao;

    @Override
    @Transactional
    public void saveLeadSkill(RDLeadSkill leadSkill) {
        leadSkillDao.save(leadSkill);
    }

	@Override
	 @Transactional
	public void addLeadSkillsIfMissing(Long id, List<Long> skillIds) {
		leadSkillDao.addLeadSkillsIfMissing(id, skillIds);
		
	}

    

}
