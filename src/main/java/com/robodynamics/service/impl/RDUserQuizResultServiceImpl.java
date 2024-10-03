package com.robodynamics.service.impl;

import java.util.Comparator;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserQuizResultDao;
import com.robodynamics.model.RDUserQuizResults;
import com.robodynamics.service.RDUserQuizResultService;

@Service
public class RDUserQuizResultServiceImpl implements RDUserQuizResultService {

    @Autowired
    private RDUserQuizResultDao quizResultDao;

    @Override
    @Transactional
    public void saveOrUpdate(RDUserQuizResults quizResult) {
        quizResultDao.saveOrUpdate(quizResult);
    }

    @Override
    @Transactional
    public RDUserQuizResults findById(int resultId) {
        return quizResultDao.findById(resultId);
    }

    @Override
    @Transactional
    public List<RDUserQuizResults> findByUserId(int userId) {
        return quizResultDao.findByUserId(userId);
    }

    @Override
    @Transactional
    public List<RDUserQuizResults> findByQuizId(int quizId) {
        return quizResultDao.findByQuizId(quizId);
    }

    @Override
    @Transactional
    public List<RDUserQuizResults> findAll() {
        return quizResultDao.findAll();
    }

    @Override
    @Transactional
    public void delete(RDUserQuizResults quizResult) {
        quizResultDao.delete(quizResult);
    }
    
    @Override
    @Transactional
    public List<RDUserQuizResults> findByUserIdAndQuizId(int userId, int quizId) {
        return quizResultDao.findByUserIdAndQuizId(userId, quizId);
    }
    
    @Override
    @Transactional
    public RDUserQuizResults findLatestByUserIdAndQuizId(int userId, int quizId) {
        List<RDUserQuizResults> results = quizResultDao.findByUserIdAndQuizId(userId, quizId);
        
        if (results == null || results.isEmpty()) {
            return null;  // No results found
        }
        
        // Assuming you want the latest result based on completion time
        results.sort(Comparator.comparing(RDUserQuizResults::getCompletedAt).reversed());
        
        return results.get(0);  // Return the most recent quiz result
    }

	@Override
	@Transactional
	public int countQuizzesTakenByUser(int userId) {
		return quizResultDao.countQuizzesTakenByUser(userId);
	}

    
}
