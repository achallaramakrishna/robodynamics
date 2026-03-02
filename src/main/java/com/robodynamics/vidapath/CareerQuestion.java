package com.robodynamics.vidapath;

import java.util.Collections;
import java.util.List;

public class CareerQuestion {

    private final String section;
    private final String questionId;
    private final String gradeBand;
    private final String questionText;
    private final String type;
    private final List<String> tags;
    private final String adaptivityNotes;

    public CareerQuestion(String section,
                          String questionId,
                          String gradeBand,
                          String questionText,
                          String type,
                          List<String> tags,
                          String adaptivityNotes) {
        this.section = section;
        this.questionId = questionId;
        this.gradeBand = gradeBand;
        this.questionText = questionText;
        this.type = type;
        this.tags = tags == null ? Collections.emptyList() : List.copyOf(tags);
        this.adaptivityNotes = adaptivityNotes;
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
