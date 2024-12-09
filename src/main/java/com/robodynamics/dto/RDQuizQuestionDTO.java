	package com.robodynamics.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RDQuizQuestionDTO {

    @JsonProperty("question_text")
    private String questionText;

    @JsonProperty("question_type")
    private String questionType;

    @JsonProperty("correct_answer")
    private String correctAnswer;

    @JsonProperty("difficulty_level")
    private String difficultyLevel;

    @JsonProperty("course_session_detail_id")
    private Integer courseSessionDetailId;
    
    @JsonProperty("points")
    private int points;  // <-- Add this field

    @JsonProperty("max_marks")
    private Integer maxMarks;

    @JsonProperty("additional_info")
    private String additionalInfo;

    @JsonProperty("slide_number") // Match with JSON field name
    private int slideNumber;

    @JsonProperty("options")
    private List<RDQuizOptionDTO> options;

 // New fields for tier level and tier order
    @JsonProperty("tierLevel")
    private String tierLevel; // Use String to represent the tier level (e.g., BEGINNER, INTERMEDIATE, ADVANCED)
    
    @JsonProperty("tierOrder")
    private int tierOrder;    // Use int for the order within the tier

    
    // Getters and setters

    public int getSlideNumber() {
        return slideNumber;
    }

    public void setSlideNumber(int slideNumber) {
        this.slideNumber = slideNumber;
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

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Integer getCourseSessionDetailId() {
        return courseSessionDetailId;
    }

    public void setCourseSessionDetailId(Integer courseSessionDetailId) {
        this.courseSessionDetailId = courseSessionDetailId;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Integer getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(Integer maxMarks) {
        this.maxMarks = maxMarks;
    }

    public String getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(String additionalInfo) {
        this.additionalInfo = additionalInfo;
    }

    public List<RDQuizOptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<RDQuizOptionDTO> options) {
        this.options = options;
    }

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public String getTierLevel() {
		return tierLevel;
	}

	public void setTierLevel(String tierLevel) {
		this.tierLevel = tierLevel;
	}

	public int getTierOrder() {
		return tierOrder;
	}

	public void setTierOrder(int tierOrder) {
		this.tierOrder = tierOrder;
	}
    
}
