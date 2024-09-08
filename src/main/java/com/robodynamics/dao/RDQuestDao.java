package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDQuest;

public interface RDQuestDao {

    // Create or update a quest
    void saveOrUpdate(RDQuest quest);

    // Find quest by its ID
    RDQuest findById(int questId);

    // Find all available quests
    List<RDQuest> findAll();

    // Delete a quest
    void delete(RDQuest quest);
}

