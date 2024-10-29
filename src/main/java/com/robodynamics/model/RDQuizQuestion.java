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
    private String questionType;  // E.g., "multiple_choice" or "fill_in_the_blank"

    @Column(name = "max_marks", nullable = false)
    private int maxMarks;
    
    @Column(name = "question_number", nullable = false)
    private int questionNumber;
    
    
    @Column(name = "points", nullable = false)
    private Integer points;
    
    @ManyToOne
    @JoinColumn(name = "slide_id", nullable = true)
    private RDSlide slide;  // New field for slide relationship


    // Add the corresponding getter and setter
    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "question_id") // This should map the correct foreign key field in `quiz_options` table
    private List<RDQuizOption> options;

    @ManyToOne
    @JoinColumn(name = "course_session_detail_id", nullable = true)
    private RDCourseSessionDetail courseSessionDetail;  // Question linked to a course session detail

    @Column(name = "difficulty_level", nullable = false)
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;  // Enum for 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'

 // Enum for DifficultyLevel
    public enum DifficultyLevel {
        Beginner,
        Intermediate,
        Advanced,
        Expert,
        Master
    }
    
    @Column(name = "correct_answer", nullable = true)  // To store correct answers for fill-in-the-blank questions
    private String correctAnswer;
    
    @Column(name = "additional_info")
    private String additionalInfo;

    public int getQuestionNumber() {
		return questionNumber;
	}

	public void setQuestionNumber(int questionNumber) {
		this.questionNumber = questionNumber;
	}

	public RDSlide getSlide() {
		return slide;
	}

	public void setSlide(RDSlide slide) {
		this.slide = slide;
	}

	public String getAdditionalInfo() {
		return additionalInfo;
	}

	public void setAdditionalInfo(String additionalInfo) {
		this.additionalInfo = additionalInfo;
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

    
    public int getMaxMarks() {
		return maxMarks;
	}

	public void setMaxMarks(int maxMarks) {
		this.maxMarks = maxMarks;
	}

	public String getQuestionType() {
        return questionType;
    }

    
    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public List<RDQuizOption> getOptions() {
        return options;
    }

    public void setOptions(List<RDQuizOption> options) {
        this.options = options;
    }
    
    // Method to find the correct option for the question
    public RDQuizOption getCorrectOption() {
        for (RDQuizOption option : options) {
            if (option.isCorrect()) {
                return option;  // Return the option where isCorrect is true
            }
        }
        return null; // No correct option found (this shouldn't happen if data is correct)
    }

    
    public RDCourseSessionDetail getCourseSessionDetail() {
		return courseSessionDetail;
	}

	public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
		this.courseSessionDetail = courseSessionDetail;
	}

	public DifficultyLevel getDifficultyLevel() {
		return difficultyLevel;
	}

	public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
		this.difficultyLevel = difficultyLevel;
	}

	
	public String getCorrectAnswer() {
		return correctAnswer;
	}

	public void setCorrectAnswer(String correctAnswer) {
		this.correctAnswer = correctAnswer;
	}
	
	

	@Override
	public String toString() {
		final int maxLen = 10;
		return "RDQuizQuestion [questionId=" + questionId + ", questionText=" + questionText + ", questionType="
				+ questionType + ", options="
				+ (options != null ? options.subList(0, Math.min(options.size(), maxLen)) : null)
				+ ", courseSessionDetail=" + courseSessionDetail + ", difficultyLevel=" + difficultyLevel
				+ ", correctAnswer=" + correctAnswer + "]";
	}

 
}
