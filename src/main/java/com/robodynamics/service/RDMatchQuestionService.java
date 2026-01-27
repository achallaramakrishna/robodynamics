package com.robodynamics.service;

import java.util.Collection;
import java.util.List;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDMatchQuestion;

public interface RDMatchQuestionService {

    void save(RDMatchQuestion question);

    RDMatchQuestion getMatchQuestion(int id);

    List<RDMatchQuestion> getAllMatchQuestions();

    RDMatchQuestion findPlayableBySessionDetail(int sessionDetailId);

    void delete(int id);

    void updateTotalPairs(int matchQuestionId);

	RDMatchQuestion findBySessionDetail(int courseSessionDetailId);
	
	List<RDMatchQuestion> findBySessionId(int sessionId);
	
}
