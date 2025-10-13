package com.robodynamics.service.impl;

import com.robodynamics.dao.RDParentNeedDao;
import com.robodynamics.model.RDParentNeed;
import com.robodynamics.service.RDParentNeedService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RDParentNeedServiceImpl implements RDParentNeedService {

    @Autowired
    private RDParentNeedDao parentNeedDao;

    @Override
    @Transactional
    public void saveNeeds(Long leadId, String learningPace, String interestLevel,
                          String objective, String subjectPriority, String teacherStyle) {
        RDParentNeed need = parentNeedDao.findByLeadId(leadId);

        if (need == null) {
            need = new RDParentNeed();
            need.setLeadId(leadId);
        }

        need.setLearningPace(learningPace);
        need.setInterestLevel(interestLevel);
        need.setObjective(objective);
        need.setSubjectPriority(subjectPriority);
        need.setTeacherStyle(teacherStyle);

        parentNeedDao.save(need);
    }

    @Override
    @Transactional(readOnly = true)
    public RDParentNeed getNeedsByLead(Long leadId) {
        return parentNeedDao.findByLeadId(leadId);
    }
}
