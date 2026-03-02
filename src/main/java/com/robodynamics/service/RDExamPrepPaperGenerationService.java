package com.robodynamics.service;

import com.robodynamics.dto.RDCreateExamPaperRequest;
import com.robodynamics.dto.RDCreateExamPaperResult;
import com.robodynamics.model.RDUser;

public interface RDExamPrepPaperGenerationService {

    RDCreateExamPaperResult generateExamPapers(RDCreateExamPaperRequest request, RDUser createdBy);
}

