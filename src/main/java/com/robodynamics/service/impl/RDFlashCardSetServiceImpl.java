package com.robodynamics.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFlashCardSetDao;
import com.robodynamics.dto.RDFlashcardSetDTO;
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
    public void deleteRDFlashCardSet(int id) {
        rdFlashCardSetDao.deleteRDFlashCardSet(id);
    }


	@Override
	@Transactional
	public RDFlashCardSet getFlashCardSetsByCourseSessionDetails(int courseSessionDetailId) {
		return rdFlashCardSetDao.getFlashCardSetsByCourseSessionDetail(courseSessionDetailId);
	}

	@Override
	public List<RDFlashcardSetDTO> getFlashCardSetsByCourseSessionDetail(int courseSessionDetailId) {
	    return rdFlashCardSetDao.findByCourseSessionDetailId(courseSessionDetailId);

	}
}
