package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamAIEvaluation;
import com.robodynamics.model.RDExamAISummary;

public interface RDExamAISummaryDAO {

    void save(RDExamAISummary summary);

    void update(RDExamAISummary summary);

    RDExamAISummary findBySubmissionId(Integer submissionId);
    
    List<RDExamAIEvaluation> findBySubmissionIdOrderByQuestionOrder(
            Integer submissionId
    );

	void saveOrUpdate(RDExamAISummary summary);
}
