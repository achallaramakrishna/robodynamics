package com.robodynamics.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.robodynamics.service.RDExamEvaluationService;
import com.robodynamics.service.RDExamSubmissionService;

@Service
public class RDExamEvaluationAsyncRunner {

    @Autowired
    private RDExamEvaluationService evaluationService;
    
    @Autowired
    private RDExamSubmissionService submissionService;

    @Async
    public void runEvaluation(Integer submissionId) {

       System.out.println("🔥 ASYNC THREAD STARTED for submissionId=" + submissionId);

        evaluationService.evaluateSubmission(submissionId);
    }

}
