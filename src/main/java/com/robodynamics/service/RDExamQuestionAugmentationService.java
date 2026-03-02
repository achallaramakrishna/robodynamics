package com.robodynamics.service;

import java.util.List;

import com.robodynamics.dto.RDCreateExamPaperRequest;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDUser;

public interface RDExamQuestionAugmentationService {

    List<RDQuizQuestion> generateAndStoreQuestions(
            RDCreateExamPaperRequest request,
            int marksShortfall,
            RDUser createdBy
    );
}

