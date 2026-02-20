package com.robodynamics.dto;

import java.util.HashMap;
import java.util.Map;

public class StudentAnswerMapResult {

    private Map<Integer, String> answersByQuestionId = new HashMap<>();
    private String reconstructionNotes; // optional debugging/audit

    public Map<Integer, String> getAnswersByQuestionId() {
        return answersByQuestionId;
    }

    public void setAnswersByQuestionId(Map<Integer, String> answersByQuestionId) {
        this.answersByQuestionId = answersByQuestionId;
    }

    public String getReconstructionNotes() {
        return reconstructionNotes;
    }

    public void setReconstructionNotes(String reconstructionNotes) {
        this.reconstructionNotes = reconstructionNotes;
    }
}
