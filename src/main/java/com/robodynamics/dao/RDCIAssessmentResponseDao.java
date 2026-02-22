package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCIAssessmentResponse;

public interface RDCIAssessmentResponseDao {

    void save(RDCIAssessmentResponse response);

    RDCIAssessmentResponse findBySessionIdAndQuestionCode(Long sessionId, String questionCode);

    List<RDCIAssessmentResponse> findBySessionId(Long sessionId);
}
