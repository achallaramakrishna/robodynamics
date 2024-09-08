package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDFlashCardAttempt;

public interface RDFlashCardAttemptDao {
    public void saveRDFlashCardAttempt(RDFlashCardAttempt rdFlashCardAttempt);

    public RDFlashCardAttempt getRDFlashCardAttempt(int attemptId);

    public List<RDFlashCardAttempt> getRDFlashCardAttempts();

    public List<RDFlashCardAttempt> getAttemptsByFlashCard(int flashCardId);

    public List<RDFlashCardAttempt> getAttemptsByUser(int userId);

    public void deleteRDFlashCardAttempt(int id);
}
