package com.robodynamics.vidapath;

import java.util.List;

public class VidaPathQuestionPayload {

    private final String section;
    private final String questionId;
    private final String gradeBand;
    private final String questionText;
    private final String type;
    private final List<String> tags;
    private final String adaptivityNotes;

    public VidaPathQuestionPayload(CareerQuestion source) {
        this.section = source.getSection();
        this.questionId = source.getQuestionId();
        this.gradeBand = source.getGradeBand();
        this.questionText = source.getQuestionText();
        this.type = source.getType();
        this.tags = source.getTags();
        this.adaptivityNotes = source.getAdaptivityNotes();
    }

    public String getSection() {
        return section;
    }

    public String getQuestionId() {
        return questionId;
    }

    public String getGradeBand() {
        return gradeBand;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getType() {
        return type;
    }

    public List<String> getTags() {
        return tags;
    }

    public String getAdaptivityNotes() {
        return adaptivityNotes;
    }
}
