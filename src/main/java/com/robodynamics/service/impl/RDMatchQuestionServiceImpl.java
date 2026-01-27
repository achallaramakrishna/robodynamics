package com.robodynamics.service.impl;

import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDMatchQuestionDAO;
import com.robodynamics.service.RDMatchQuestionService;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDMatchQuestion;

@Service
@Transactional
public class RDMatchQuestionServiceImpl implements RDMatchQuestionService {

    @Autowired
    private RDMatchQuestionDAO matchQuestionDAO;

    @Override
    public void save(RDMatchQuestion question) {
        matchQuestionDAO.save(question);
    }

    @Override
    public RDMatchQuestion getMatchQuestion(int id) {
        return matchQuestionDAO.findById(id);
    }

    @Override
    public List<RDMatchQuestion> getAllMatchQuestions() {
        return matchQuestionDAO.findAll();
    }

    @Override
    public RDMatchQuestion findPlayableBySessionDetail(int sessionDetailId) {
        return matchQuestionDAO.findPlayableBySessionDetail(sessionDetailId);
    }

    @Override
    public void delete(int id) {
        matchQuestionDAO.delete(id);
    }

    @Override
    public void updateTotalPairs(int matchQuestionId) {
        matchQuestionDAO.updateTotalPairs(matchQuestionId);
    }



	@Override
	public RDMatchQuestion findBySessionDetail(int courseSessionDetailId) {
		
		return matchQuestionDAO.findBySessionDetail(courseSessionDetailId);
	}

	@Override
	public List<RDMatchQuestion> findBySessionId(int sessionId) {
		return matchQuestionDAO.findBySessionId(sessionId);
	}
}
