package com.robodynamics.model;

import javax.persistence.*;

import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

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

    @ManyToOne
    @JoinColumn(name = "course_session_detail_id")
    private RDCourseSessionDetail courseSessionDetail;

 
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "flashcard_set_id") // This should map the correct foreign key field in `quiz_options` table
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

    

    public RDCourseSessionDetail getCourseSessionDetail() {
		return courseSessionDetail;
	}

	public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
		this.courseSessionDetail = courseSessionDetail;
	}

	public List<RDFlashCard> getFlashcards() {
        return flashcards;
    }

    public void setFlashcards(List<RDFlashCard> flashcards) {
        this.flashcards = flashcards;
    }
}
