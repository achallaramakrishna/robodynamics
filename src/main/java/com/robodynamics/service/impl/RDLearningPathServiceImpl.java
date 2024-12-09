package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDLearningPathDao;
import com.robodynamics.model.RDLearningPath;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDExam;
import com.robodynamics.service.RDLearningPathService;

@Service
public class RDLearningPathServiceImpl implements RDLearningPathService {

    @Autowired
    private RDLearningPathDao learningPathDao;

    @Override
    @Transactional
    public void saveLearningPath(RDLearningPath learningPath) {
        learningPathDao.save(learningPath);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isLearningPathExists(RDUser user, RDExam exam, int examYear) {
        return learningPathDao.findByUserExamAndYear(user, exam, examYear) != null;
    }

	@Override
	@Transactional
	public RDLearningPath getLearningPathById(int id) {
		RDLearningPath learningPath = learningPathDao.findById(id);
        if (learningPath == null) {
            throw new IllegalArgumentException("Learning Path not found with ID: " + id);
        }
        return learningPath;

	}

	@Override
	@Transactional
	public List<RDLearningPath> getLearningPathsByUser(RDUser user) {
		// TODO Auto-generated method stub
        return learningPathDao.findByUser(user);

	}

	@Override
	@Transactional
	public List<RDLearningPath> findPathsByParent(int userID) {
		return learningPathDao.findPathsByParent(userID);
	}
}
