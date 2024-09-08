package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFlashCardSetDao;
import com.robodynamics.model.RDFlashCardSet;
import com.robodynamics.service.RDFlashCardSetService;

@Service
public class RDFlashCardSetServiceImpl implements RDFlashCardSetService {

    @Autowired
    private RDFlashCardSetDao rdFlashCardSetDao;

    @Override
    @Transactional
    public void saveRDFlashCardSet(RDFlashCardSet rdFlashCardSet) {
        rdFlashCardSetDao.saveRDFlashCardSet(rdFlashCardSet);
    }

    @Override
    @Transactional
    public RDFlashCardSet getRDFlashCardSet(int flashcardSetId) {
        return rdFlashCardSetDao.getRDFlashCardSet(flashcardSetId);
    }

    @Override
    @Transactional
    public List<RDFlashCardSet> getRDFlashCardSets() {
        return rdFlashCardSetDao.getRDFlashCardSets();
    }

    @Override
    @Transactional
    public List<RDFlashCardSet> getFlashCardSetsBySessionDetail(int courseSessionDetailId) {
        return rdFlashCardSetDao.getFlashCardSetsBySessionDetail(courseSessionDetailId);
    }

    @Override
    @Transactional
    public void deleteRDFlashCardSet(int id) {
        rdFlashCardSetDao.deleteRDFlashCardSet(id);
    }
}
