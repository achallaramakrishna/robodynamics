package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDFlashCard;

public interface RDFlashCardService {
    void saveRDFlashCard(RDFlashCard rdFlashCard);

    RDFlashCard getRDFlashCard(int flashCardId);

    List<RDFlashCard> getFlashCardsBySetId(int flashcardSetId);

    void deleteRDFlashCard(int id);
    
    List<RDFlashCard> getRDFlashCards();

    List<RDFlashCard> getFlashcardsByCourseSessionDetailId(int courseSessionDetailId);

    
    
}
