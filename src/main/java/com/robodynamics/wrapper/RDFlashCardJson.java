package com.robodynamics.wrapper;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RDFlashCardJson {

    private String question;
    private String answer;
    private String hint;
    private String imageUrl;
    private String example; // Matches the JSON's "example" field
    private String insight; // Matches the JSON's "insight" field
    private String insightType; // For insight type, such as "NEET", "JEE", etc.

    // Getters and setters

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
    }

    public String getInsight() {
        return insight;
    }

    public void setInsight(String insight) {
        this.insight = insight;
    }

    public String getInsightType() {
        return insightType;
    }

    public void setInsightType(String insightType) {
        this.insightType = insightType;
    }
}
