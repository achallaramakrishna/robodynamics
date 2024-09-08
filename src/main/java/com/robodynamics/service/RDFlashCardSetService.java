package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDFlashCardSet;

public interface RDFlashCardSetService {
    void saveRDFlashCardSet(RDFlashCardSet rdFlashCardSet);

    RDFlashCardSet getRDFlashCardSet(int flashcardSetId);

    List<RDFlashCardSet> getRDFlashCardSets();

    List<RDFlashCardSet> getFlashCardSetsBySessionDetail(int courseSessionDetailId);

    void deleteRDFlashCardSet(int id);
}
