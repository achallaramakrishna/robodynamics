package com.robodynamics.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "rd_flashcard_sets")
public class RDFlashCardSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flashcard_set_id")
    private int flashcardSetId;

    @Column(name = "set_name", nullable = false)
    private String setName;

    @Column(name = "set_description")
    private String setDescription;

    @Column(name = "course_session_detail_id", nullable = false)
    private int courseSessionDetailId;

    @OneToMany(mappedBy = "flashcardSet", cascade = CascadeType.ALL)
    private List<RDFlashCard> flashcards;

    // Getters and Setters

    public int getFlashcardSetId() {
        return flashcardSetId;
    }

    public void setFlashcardSetId(int flashcardSetId) {
        this.flashcardSetId = flashcardSetId;
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

    public int getCourseSessionDetailId() {
        return courseSessionDetailId;
    }

    public void setCourseSessionDetailId(int courseSessionDetailId) {
        this.courseSessionDetailId = courseSessionDetailId;
    }

    public List<RDFlashCard> getFlashcards() {
        return flashcards;
    }

    public void setFlashcards(List<RDFlashCard> flashcards) {
        this.flashcards = flashcards;
    }
}
