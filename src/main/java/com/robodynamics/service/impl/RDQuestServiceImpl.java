package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuestDao;
import com.robodynamics.model.RDQuest;
import com.robodynamics.service.RDQuestService;

@Service
public class RDQuestServiceImpl implements RDQuestService {

    @Autowired
    private RDQuestDao rdQuestDao;

    @Override
    @Transactional
    public void saveOrUpdate(RDQuest quest) {
        rdQuestDao.saveOrUpdate(quest);
    }

    @Override
    @Transactional
    public RDQuest findById(int questId) {
        return rdQuestDao.findById(questId);
    }

    @Override
    @Transactional
    public List<RDQuest> findAll() {
        return rdQuestDao.findAll();
    }

    @Override
    @Transactional
    public void delete(RDQuest quest) {
        rdQuestDao.delete(quest);
    }
}
