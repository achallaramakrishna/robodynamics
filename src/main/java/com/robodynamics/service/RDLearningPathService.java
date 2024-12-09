package com.robodynamics.service;

import com.robodynamics.model.RDLearningPath;
import com.robodynamics.model.RDUser;

import java.util.List;

import com.robodynamics.model.RDExam;

public interface RDLearningPathService {
    void saveLearningPath(RDLearningPath learningPath);

    boolean isLearningPathExists(RDUser user, RDExam exam, int examYear);
    
    RDLearningPath getLearningPathById(int id);
    List<RDLearningPath> getLearningPathsByUser(RDUser user);

	List<RDLearningPath> findPathsByParent(int userID);


}
