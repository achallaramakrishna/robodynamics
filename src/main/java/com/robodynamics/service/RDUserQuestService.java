package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDUserQuest;

public interface RDUserQuestService {

    // Create or update a user quest record
    void saveOrUpdate(RDUserQuest userQuest);

    // Find all quests completed by a specific user
    List<RDUserQuest> findByUserId(int userId);

    // Find all user quests
    List<RDUserQuest> findAll();

    // Delete a user quest record
    void delete(RDUserQuest userQuest);
    
    boolean isQuestCompletedByUser(int userId, int questId);
    
    int countQuizzesCompletedByUser(int userId);
}
