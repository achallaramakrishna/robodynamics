package com.robodynamics.service;

import com.robodynamics.dto.RDExerciseExtractionRequest;
import com.robodynamics.dto.RDExerciseExtractionResult;
import com.robodynamics.model.RDUser;

public interface RDExercisePdfExtractionService {

    RDExerciseExtractionResult extractExercisesToJsonAndUpload(
            RDExerciseExtractionRequest request,
            RDUser actor
    ) throws Exception;
}

