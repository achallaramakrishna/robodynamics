package com.robodynamics.dao;

import com.robodynamics.model.RDLearningPath;
import com.robodynamics.model.RDUser;

import java.util.List;

import com.robodynamics.model.RDExam;

public interface RDLearningPathDao {
    void save(RDLearningPath learningPath);

    RDLearningPath findByUserExamAndYear(RDUser user, RDExam exam, int examYear);

	RDLearningPath findById(int id);

	List<RDLearningPath> findByUser(RDUser user);

	List<RDLearningPath> findPathsByParent(int userID);
}
