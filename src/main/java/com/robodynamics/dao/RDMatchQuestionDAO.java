package com.robodynamics.dao;

import java.util.Collection;
import java.util.List;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDMatchQuestion;

public interface RDMatchQuestionDAO {

    void save(RDMatchQuestion question);

    RDMatchQuestion findById(int id);

    List<RDMatchQuestion> findAll();

    RDMatchQuestion findPlayableBySessionDetail(int courseSessionDetailId);

    void delete(int id);

    void updateTotalPairs(int matchQuestionId);

    RDMatchQuestion findBySessionDetail(int courseSessionDetailId);

	List<RDMatchQuestion> findBySessionId(int sessionId);
}
