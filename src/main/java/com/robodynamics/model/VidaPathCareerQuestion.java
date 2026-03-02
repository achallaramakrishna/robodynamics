package com.robodynamics.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vida_path_question_bank")
public class VidaPathCareerQuestion {

    @Id
    @Column(name = "question_id", nullable = false, length = 64)
    private String questionId;

    @Column(name = "section", nullable = false, length = 128)
    private String section;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "grade_band", nullable = false, length = 32)
    private String gradeBand;

    @Column(name = "question_type", nullable = false, length = 64)
    private String type;

    @Column(name = "is_archived", nullable = false)
    private boolean archived;

    @Column(name = "content_version", length = 32)
    private String contentVersion;

    @Column(name = "tags", columnDefinition = "TEXT")
    private String tags;

    @Column(name = "adaptivity_notes", columnDefinition = "TEXT")
    private String adaptivityNotes;

    protected VidaPathCareerQuestion() {
        // Hibernate
    }

    public String getQuestionId() {
        return questionId;
    }

    public String getSection() {
        return section;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getGradeBand() {
        return gradeBand;
    }

    public String getType() {
        return type;
    }

    public boolean isArchived() {
        return archived;
    }

    public String getContentVersion() {
        return contentVersion;
    }

    public String getTags() {
        return tags;
    }

    public String getAdaptivityNotes() {
        return adaptivityNotes;
    }
}
