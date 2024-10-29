package com.robodynamics.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RDQuizOptionDTO {
    
    @JsonProperty("option_text")
    private String optionText;

    @JsonProperty("is_correct")
    private boolean isCorrect;

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public boolean isCorrect() {
        return isCorrect;
    }

    public void setCorrect(boolean isCorrect) {
        this.isCorrect = isCorrect;
    }
}
