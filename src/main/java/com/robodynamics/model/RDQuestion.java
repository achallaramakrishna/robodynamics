package com.robodynamics.model;


import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "rd_questions")
public class RDQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private int questionId;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "question_type", nullable = false)
    private String questionType;  // "multiple_choice" or "fill_in_the_blank"

    @Column(name = "correct_answer", nullable = true)
    private String correctAnswer;  // Correct answer for fill-in-the-blank questions

    @Column(name = "difficulty_level", nullable = false)
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;  // Difficulty level (Beginner to Master)

    @Column(name = "points", nullable = false)
    private int points;  // Points for the question

    // Foreign key for session details
    @ManyToOne
    @JoinColumn(name = "course_session_detail_id", nullable = true)
    private RDCourseSessionDetail courseSessionDetail;

    // Foreign key for slides
    @ManyToOne
    @JoinColumn(name = "slide_id", nullable = true)
    private RDSlide slide;

    // One-to-Many relationship with RDQuizOption for multiple-choice questions
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<RDQuizOption> options;

    // Enum for Difficulty Level
    public enum DifficultyLevel {
        Beginner,
        Intermediate,
        Advanced,
        Expert,
        Master
    }

    // Getters and Setters
    public int getQuestionId() {
        return questionId;
    }

    public void setQuestionId(int questionId) {
        this.questionId = questionId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public RDCourseSessionDetail getCourseSessionDetail() {
        return courseSessionDetail;
    }

    public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
        this.courseSessionDetail = courseSessionDetail;
    }

    public RDSlide getSlide() {
        return slide;
    }

    public void setSlide(RDSlide slide) {
        this.slide = slide;
    }

    public List<RDQuizOption> getOptions() {
        return options;
    }

    public void setOptions(List<RDQuizOption> options) {
        this.options = options;
    }
}
