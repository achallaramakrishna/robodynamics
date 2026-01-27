package com.robodynamics.dto;

public class RDFlashCardSetUploadDTO {

    private String setName;
    private String setDescription;

    public RDFlashCardSetUploadDTO() {
        // default constructor required for Jackson
    }

    public String getSetName() {
        return setName;
    }

    public void setSetName(String setName) {
        this.setName = setName;
    }

    public String getSetDescription() {
        return setDescription;
    }

    public void setSetDescription(String setDescription) {
        this.setDescription = setDescription;
    }
}
