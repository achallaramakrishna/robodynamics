package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserQuestDao;
import com.robodynamics.model.RDUserQuest;
import com.robodynamics.service.RDUserQuestService;

@Service
public class RDUserQuestServiceImpl implements RDUserQuestService {

    @Autowired
    private RDUserQuestDao rdUserQuestDao;

    @Override
    @Transactional
    public void saveOrUpdate(RDUserQuest userQuest) {
        rdUserQuestDao.saveOrUpdate(userQuest);
    }

    @Override
    @Transactional
    public List<RDUserQuest> findByUserId(int userId) {
        return rdUserQuestDao.findByUserId(userId);
    }

    @Override
    @Transactional
    public List<RDUserQuest> findAll() {
        return rdUserQuestDao.findAll();
    }

    @Override
    @Transactional
    public void delete(RDUserQuest userQuest) {
        rdUserQuestDao.delete(userQuest);
    }

	@Override
	public boolean isQuestCompletedByUser(int userId, int questId) {
		return rdUserQuestDao.isQuestCompletedByUser(userId,questId);
	}

	@Override
    public int countQuizzesCompletedByUser(int userId) {
        return rdUserQuestDao.countQuizzesCompletedByUser(userId);
    }
}
