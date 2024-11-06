package com.robodynamics.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;
import java.util.Set;

@Entity
@Table(name = "rd_quizzes")
public class RDQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private int quizId;

    @Column(name = "quiz_name", nullable = false)
    private String quizName;

    @Column(name = "difficulty_level")
    private String difficultyLevel;

    @Column(name = "quiz_type", nullable = false)
    private String quizType;  // This could be something like "multiple_choice" or "fill_in_the_blank"

    @Column(name = "time_limit_seconds")
    private int timeLimitSeconds;
    
    @Column(name = "status")
    private String status;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "quiz")
    @JsonIgnore // Prevents the field from being serialized
    private Set<RDQuizQuestionMap> quizQuestionMappings;
    
    @Column(name = "category")
    private String category;

    @Column(name = "is_featured", nullable = false)
    private boolean isFeatured;

    // Getters and Setters

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean isFeatured) {
        this.isFeatured = isFeatured;
    }
    
    
    @Column(name = "grade_range")
    @Enumerated(EnumType.STRING)
    private GradeRange gradeRange;

    // Enum for GradeRange (reuse or add as needed)
    public enum GradeRange {
        LOWER_PRIMARY_1_3("Lower Primary (Grades 1-3)"),
        UPPER_PRIMARY_4_6("Upper Primary (Grades 4-6)"),
        MIDDLE_SCHOOL_7_9("Middle School (Grades 7-9)"),
        HIGH_SCHOOL_10_12("High School (Grades 10-12)"),
        ALL_GRADES("All Grades");

        private final String displayName;

        GradeRange(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
    @Column(name="short_description")
    private String shortDescription;
    
    // Getter and Setter for shortDescription
    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }
    
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public GradeRange getGradeRange() {
        return gradeRange;
    }

    public void setGradeRange(GradeRange gradeRange) {
        this.gradeRange = gradeRange;
    }
    // Constructors
    public RDQuiz() {}

    public RDQuiz(String quizName, String difficultyLevel, String quizType, int timeLimitSeconds) {
        this.quizName = quizName;
        this.difficultyLevel = difficultyLevel;
        this.quizType = quizType;
        this.timeLimitSeconds = timeLimitSeconds;
    }

    // Getters and Setters
    public int getQuizId() {
        return quizId;
    }

    public void setQuizId(int quizId) {
        this.quizId = quizId;
    }

    public String getQuizName() {
        return quizName;
    }

    public void setQuizName(String quizName) {
        this.quizName = quizName;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public String getQuizType() {
        return quizType;
    }

    public void setQuizType(String quizType) {
        this.quizType = quizType;
    }

    public int getTimeLimitSeconds() {
        return timeLimitSeconds;
    }

    public void setTimeLimitSeconds(int timeLimitSeconds) {
        this.timeLimitSeconds = timeLimitSeconds;
    }



    public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Set<RDQuizQuestionMap> getQuizQuestionMappings() {
		return quizQuestionMappings;
	}

	public void setQuizQuestionMappings(Set<RDQuizQuestionMap> quizQuestionMappings) {
		this.quizQuestionMappings = quizQuestionMappings;
	}

	
	
}
