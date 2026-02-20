package com.robodynamics.service;

import java.util.Map;

import com.robodynamics.dto.StudentAnswerMapResult;
import com.robodynamics.model.RDExamPaper;

public interface AITextReconstructionService {

    /**
     * Converts raw OCR text into per-question answers.
     * Key = RDExamSectionQuestion.getId()
     * Value = reconstructed student answer text for that question (can be empty).
     */
    StudentAnswerMapResult reconstructAnswers(RDExamPaper examPaper, String ocrText);

    /**
     * Convenience helper when you only need the map.
     */
    default Map<Integer, String> reconstructAnswersMap(RDExamPaper examPaper, String ocrText) {
        return reconstructAnswers(examPaper, ocrText).getAnswersByQuestionId();
    }
}
