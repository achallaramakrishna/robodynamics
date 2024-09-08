package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFlashCardDao;
import com.robodynamics.model.RDFlashCard;
import com.robodynamics.service.RDFlashCardService;

@Service
public class RDFlashCardServiceImpl implements RDFlashCardService {

    @Autowired
    private RDFlashCardDao rdFlashCardDao;

    @Override
    @Transactional
    public void saveRDFlashCard(RDFlashCard rdFlashCard) {
        rdFlashCardDao.saveRDFlashCard(rdFlashCard);
    }

    @Override
    @Transactional
    public RDFlashCard getRDFlashCard(int flashCardId) {
        return rdFlashCardDao.getRDFlashCard(flashCardId);
    }

    @Override
    @Transactional
    public List<RDFlashCard> getFlashCardsBySetId(int flashcardSetId) {
        return rdFlashCardDao.getFlashCardsBySetId(flashcardSetId);
    }

    @Override
    @Transactional
    public void deleteRDFlashCard(int id) {
        rdFlashCardDao.deleteRDFlashCard(id);
    }
}
