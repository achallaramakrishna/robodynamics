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
    private int points;

    @JsonProperty("exam_type")
    private String examType;

    // 🔥 NEW FIELDS
    @JsonProperty("exam_year")
    private Integer examYear;

    @JsonProperty("exam_paper")
    private String examPaper;

    @JsonProperty("is_pyq")
    private Boolean isPYQ;

    @JsonProperty("max_marks")
    private Integer maxMarks;

    @JsonProperty("additional_info")
    private String additionalInfo;

    @JsonProperty("slide_number")
    private int slideNumber;

    @JsonProperty("options")
    private List<RDQuizOptionDTO> options;

    @JsonProperty("tierLevel")
    private String tierLevel;

    @JsonProperty("tierOrder")
    private int tierOrder;


    // =======================
    // Getters & Setters
    // =======================

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public Integer getExamYear() { return examYear; }
    public void setExamYear(Integer examYear) { this.examYear = examYear; }

    public String getExamPaper() { return examPaper; }
    public void setExamPaper(String examPaper) { this.examPaper = examPaper; }

    public Boolean getIsPYQ() { return isPYQ; }
    public void setIsPYQ(Boolean isPYQ) { this.isPYQ = isPYQ; }

    public int getSlideNumber() { return slideNumber; }
    public void setSlideNumber(int slideNumber) { this.slideNumber = slideNumber; }

    public String getQuestionText() { return questionText; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }

    public String getQuestionType() { return questionType; }
    public void setQuestionType(String questionType) { this.questionType = questionType; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public Integer getCourseSessionDetailId() { return courseSessionDetailId; }
    public void setCourseSessionDetailId(Integer courseSessionDetailId) { this.courseSessionDetailId = courseSessionDetailId; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public Integer getMaxMarks() { return maxMarks; }
    public void setMaxMarks(Integer maxMarks) { this.maxMarks = maxMarks; }

    public String getAdditionalInfo() { return additionalInfo; }
    public void setAdditionalInfo(String additionalInfo) { this.additionalInfo = additionalInfo; }

    public List<RDQuizOptionDTO> getOptions() { return options; }
    public void setOptions(List<RDQuizOptionDTO> options) { this.options = options; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public String getTierLevel() { return tierLevel; }
    public void setTierLevel(String tierLevel) { this.tierLevel = tierLevel; }

    public int getTierOrder() { return tierOrder; }
    public void setTierOrder(int tierOrder) { this.tierOrder = tierOrder; }
}
