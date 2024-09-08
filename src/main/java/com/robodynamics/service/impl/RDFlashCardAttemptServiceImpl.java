package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFlashCardAttemptDao;
import com.robodynamics.model.RDFlashCardAttempt;
import com.robodynamics.service.RDFlashCardAttemptService;

@Service
public class RDFlashCardAttemptServiceImpl implements RDFlashCardAttemptService {

    @Autowired
    private RDFlashCardAttemptDao rdFlashCardAttemptDao;

    @Override
    @Transactional
    public void saveRDFlashCardAttempt(RDFlashCardAttempt rdFlashCardAttempt) {
        rdFlashCardAttemptDao.saveRDFlashCardAttempt(rdFlashCardAttempt);
    }

    @Override
    @Transactional
    public RDFlashCardAttempt getRDFlashCardAttempt(int attemptId) {
        return rdFlashCardAttemptDao.getRDFlashCardAttempt(attemptId);
    }

    @Override
    @Transactional
    public List<RDFlashCardAttempt> getRDFlashCardAttempts() {
        return rdFlashCardAttemptDao.getRDFlashCardAttempts();
    }

    @Override
    @Transactional
    public List<RDFlashCardAttempt> getAttemptsByFlashCard(int flashCardId) {
        return rdFlashCardAttemptDao.getAttemptsByFlashCard(flashCardId);
    }

    @Override
    @Transactional
    public List<RDFlashCardAttempt> getAttemptsByUser(int userId) {
        return rdFlashCardAttemptDao.getAttemptsByUser(userId);
    }

    @Override
    @Transactional
    public void deleteRDFlashCardAttempt(int id) {
        rdFlashCardAttemptDao.deleteRDFlashCardAttempt(id);
    }
}
