package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDFlashCard;

public interface RDFlashCardDao {
    void saveRDFlashCard(RDFlashCard rdFlashCard);

    RDFlashCard getRDFlashCard(int flashCardId);

    List<RDFlashCard> getFlashCardsBySetId(int flashcardSetId);

    void deleteRDFlashCard(int id);
}
