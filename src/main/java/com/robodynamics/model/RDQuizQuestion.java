package com.robodynamics.model;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "rd_quiz_questions")
public class RDQuizQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "question_id")
    private int questionId;

    @Column(name = "question_text", nullable = false)
    private String questionText;

    @Column(name = "question_type", nullable = false)
    private String questionType;
    
    @Column(name = "question_image")
    private String questionImage;  // Store the URL or file path

    @Column(name = "correct_answer")
    private String correctAnswer;

    @Column(name = "difficulty_level", nullable = false)
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    @Column(name = "max_marks")
    private int maxMarks;

    @Column(name = "additional_info")
    private String additionalInfo;

    @Column(name = "points")
    private Integer points;
    
    @Column(name = "is_active")
    private boolean active = true;

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }


    @Column(name = "tier_level")
    @Enumerated(EnumType.STRING)
    private TierLevel tierLevel;

    @Column(name = "tier_order")
    private int tierOrder;

    @Column(name = "explanation")
    private String explanation;

    @Column(name = "exam_type")
    private String examType;

    @Column(name = "syllabus_tag")
    private String syllabusTag;

    @ManyToOne
    @JoinColumn(name = "course_session_detail_id")
    private RDCourseSessionDetail courseSessionDetail;

    @ManyToOne
    @JoinColumn(name = "course_session_id")
    private RDCourseSession courseSession;

    @ManyToOne
    @JoinColumn(name = "exam_course_id")
    private RDExamCourse examCourse;
    
    @Column(name = "exam_year")
    private Integer examYear;

    @Column(name = "exam_paper")
    private String examPaper;

    @Column(name = "is_pyq")
    private Boolean isPYQ;

    
    
    
    public Integer getExamYear() {
		return examYear;
	}

	public void setExamYear(Integer examYear) {
		this.examYear = examYear;
	}

	public String getExamPaper() {
		return examPaper;
	}

	public void setExamPaper(String examPaper) {
		this.examPaper = examPaper;
	}

	public Boolean getIsPYQ() {
		return isPYQ;
	}

	public void setIsPYQ(Boolean isPYQ) {
		this.isPYQ = isPYQ;
	}

	public String getQuestionImage() {
		return questionImage;
	}

	public void setQuestionImage(String questionImage) {
		this.questionImage = questionImage;
	}

	@ManyToOne
    @JoinColumn(name = "slide_id")
    private RDSlide slide;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "question_id") // FK in `quiz_options` table
    private List<RDQuizOption> options;

    // Enum for DifficultyLevel
    public enum DifficultyLevel {
        Easy, Medium, Hard, Expert, Master
    }

    // Enum for TierLevel
    public enum TierLevel {
        BEGINNER, INTERMEDIATE, ADVANCED
    }

    // Constructors
    public RDQuizQuestion() {}

    public RDQuizQuestion(String questionText, String questionType) {
        this.questionText = questionText;
        this.questionType = questionType;
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

    public int getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(int maxMarks) {
        this.maxMarks = maxMarks;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public TierLevel getTierLevel() {
        return tierLevel;
    }

    public void setTierLevel(TierLevel tierLevel) {
        this.tierLevel = tierLevel;
    }

    public int getTierOrder() {
        return tierOrder;
    }

    public void setTierOrder(int tierOrder) {
        this.tierOrder = tierOrder;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getExamType() {
        return examType;
    }

    public void setExamType(String examType) {
        this.examType = examType;
    }

    public String getSyllabusTag() {
        return syllabusTag;
    }

    public void setSyllabusTag(String syllabusTag) {
        this.syllabusTag = syllabusTag;
    }

    public RDCourseSessionDetail getCourseSessionDetail() {
        return courseSessionDetail;
    }

    public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
        this.courseSessionDetail = courseSessionDetail;
    }

    public RDCourseSession getCourseSession() {
        return courseSession;
    }

    public void setCourseSession(RDCourseSession courseSession) {
        this.courseSession = courseSession;
    }

    public RDExamCourse getExamCourse() {
        return examCourse;
    }

    public void setExamCourse(RDExamCourse examCourse) {
        this.examCourse = examCourse;
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

    // Utility methods
    public RDQuizOption getCorrectOption() {
        if (options != null) {
            for (RDQuizOption option : options) {
                if (option.isCorrect()) {
                    return option;
                }
            }
        }
        return null;
    }

    @Override
    public String toString() {
        final int maxLen = 10;
        return "RDQuizQuestion{" +
               "questionId=" + questionId +
               ", questionText='" + questionText + '\'' +
               ", questionType='" + questionType + '\'' +
               ", difficultyLevel=" + difficultyLevel +
               ", options=" + (options != null ? options.subList(0, Math.min(options.size(), maxLen)) : null) +
               '}';
    }
}
