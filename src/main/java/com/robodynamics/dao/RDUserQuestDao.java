package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDUserQuest;

public interface RDUserQuestDao {

    // Create or update a user quest record
    void saveOrUpdate(RDUserQuest userQuest);

    // Find all quests completed by a specific user
    List<RDUserQuest> findByUserId(int userId);

    // Find all user quests
    List<RDUserQuest> findAll();

    // Delete a user quest record
    void delete(RDUserQuest userQuest);
    
 // Find a specific quest completed by a user
    RDUserQuest findByUserIdAndQuestId(int userId, int questId);

    // Count the total number of quizzes completed by a user
    int countQuizzesCompletedByUser(int userId);

    public boolean isQuestCompletedByUser(int userId, int questId);
    
}
