package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDFlashCardSet;

public interface RDFlashCardSetDao {
	
    void saveRDFlashCardSet(RDFlashCardSet rdFlashCardSet);
    
    RDFlashCardSet getRDFlashCardSet(int flashcardSetId);
    
    List<RDFlashCardSet> getRDFlashCardSets();
    
    void deleteRDFlashCardSet(int id);

	RDFlashCardSet getFlashCardSetsByCourseSessionDetail(int courseSessionDetailId);
}
