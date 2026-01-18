package com.robodynamics.dto;

public class RDFlashcardSetDTO {
    private int flashcardSetId;
    private String setName;
    private String setDescription;

    public RDFlashcardSetDTO(int flashcardSetId, String setName, String setDescription) {
        this.flashcardSetId = flashcardSetId;
        this.setName = setName;
        this.setDescription = setDescription;
    }

    public int getFlashcardSetId() { return flashcardSetId; }
    public String getSetName() { return setName; }
    public String getSetDescription() { return setDescription; }
}
