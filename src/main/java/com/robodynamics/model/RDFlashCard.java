package com.robodynamics.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Table(name = "rd_flashcards")
public class RDFlashCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flashcard_id")
    private int flashcardId;

    @Column(name = "question", nullable = false)
    private String question;

    @Column(name = "answer", nullable = false)
    private String answer;

    @Column(name = "hint")
    private String hint;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "flashcard_set_id", nullable = false)
    @JsonBackReference  // This prevents infinite recursion during JSON serialization
    private RDFlashCardSet flashcardSet;

    @OneToMany(mappedBy = "flashCard", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<RDFlashCardAttempt> attempts;

    // Getters and Setters

    public int getFlashcardId() {
        return flashcardId;
    }

    public void setFlashcardId(int flashcardId) {
        this.flashcardId = flashcardId;
    }

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

    public RDFlashCardSet getFlashcardSet() {
        return flashcardSet;
    }

    public void setFlashcardSet(RDFlashCardSet flashcardSet) {
        this.flashcardSet = flashcardSet;
    }

    public List<RDFlashCardAttempt> getAttempts() {
        return attempts;
    }

    public void setAttempts(List<RDFlashCardAttempt> attempts) {
        this.attempts = attempts;
    }
}
