package com.robodynamics.dto;

public class McqOptionView {

    private String optionText;
    private boolean correct;
    private boolean selectedByStudent;

    public McqOptionView(String optionText, boolean correct, boolean selectedByStudent) {
        this.optionText = optionText;
        this.correct = correct;
        this.selectedByStudent = selectedByStudent;
    }

    public String getOptionText() { return optionText; }
    public boolean isCorrect() { return correct; }
    public boolean isSelectedByStudent() { return selectedByStudent; }
}
