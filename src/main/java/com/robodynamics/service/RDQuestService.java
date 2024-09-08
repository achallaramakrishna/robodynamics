package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDQuest;

public interface RDQuestService {

    // Create or update a quest
    void saveOrUpdate(RDQuest quest);

    // Find quest by its ID
    RDQuest findById(int questId);

    // Find all available quests
    List<RDQuest> findAll();

    // Delete a quest
    void delete(RDQuest quest);
}
