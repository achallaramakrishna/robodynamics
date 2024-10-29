package com.robodynamics.model;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

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

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    @JsonIgnore // Prevents the field from being serialized
    private List<RDQuizQuestionMap> quizQuestionMappings;
    
    
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

	public List<RDQuizQuestionMap> getQuizQuestionMappings() {
		return quizQuestionMappings;
	}

	public void setQuizQuestionMappings(List<RDQuizQuestionMap> quizQuestionMappings) {
		this.quizQuestionMappings = quizQuestionMappings;
	}

	@Override
	public String toString() {
		final int maxLen = 10;
		return "RDQuiz [quizId=" + quizId + ", quizName=" + quizName + ", difficultyLevel=" + difficultyLevel
				+ ", quizType=" + quizType + ", timeLimitSeconds=" + timeLimitSeconds + ", status=" + status
				+ ", quizQuestionMappings="
				+ (quizQuestionMappings != null
						? quizQuestionMappings.subList(0, Math.min(quizQuestionMappings.size(), maxLen))
						: null)
				+ "]";
	}

	
}
