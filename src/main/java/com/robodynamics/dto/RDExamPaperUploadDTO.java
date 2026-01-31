package com.robodynamics.dto;

import java.util.List;

public class RDExamPaperUploadDTO {

    /* ================= PAPER LEVEL ================= */

    private String title;
    private String subject;          // Mathematics / Physics
    private String board;            // CBSE / ICSE / NEET
    private Integer examYear;         // 2025
    private String examType;          // FINAL / MOCK / UNIT_TEST
    private String patternCode;       // CBSE_G5_FINAL

    private Integer durationMinutes;  // 120
    private Integer totalMarks;        // 80

    private String instructions;

    /* ================= MARKING / CBT ================= */

    private Boolean negativeMarking;
    private Double negativeMarkValue;
    private Boolean shuffleSections;
    private Boolean shuffleQuestions;

    /* ================= STRUCTURE ================= */

    private List<SectionDTO> sections;

    /* ================= GETTERS & SETTERS ================= */

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getBoard() { return board; }
    public void setBoard(String board) { this.board = board; }

    public Integer getExamYear() { return examYear; }
    public void setExamYear(Integer examYear) { this.examYear = examYear; }

    public String getExamType() { return examType; }
    public void setExamType(String examType) { this.examType = examType; }

    public String getPatternCode() { return patternCode; }
    public void setPatternCode(String patternCode) { this.patternCode = patternCode; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Integer getTotalMarks() { return totalMarks; }
    public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public Boolean getNegativeMarking() { return negativeMarking; }
    public void setNegativeMarking(Boolean negativeMarking) { this.negativeMarking = negativeMarking; }

    public Double getNegativeMarkValue() { return negativeMarkValue; }
    public void setNegativeMarkValue(Double negativeMarkValue) { this.negativeMarkValue = negativeMarkValue; }

    public Boolean getShuffleSections() { return shuffleSections; }
    public void setShuffleSections(Boolean shuffleSections) { this.shuffleSections = shuffleSections; }

    public Boolean getShuffleQuestions() { return shuffleQuestions; }
    public void setShuffleQuestions(Boolean shuffleQuestions) { this.shuffleQuestions = shuffleQuestions; }

    public List<SectionDTO> getSections() { return sections; }
    public void setSections(List<SectionDTO> sections) { this.sections = sections; }

    /* =====================================================
       SECTION DTO
       ===================================================== */
    public static class SectionDTO {

        private String sectionName;       // A / B / C
        private String title;             // Section A – Objective
        private String description;
        private String instructions;

        private String attemptType;       // ALL / ANY_N
        private Integer attemptCount;

        private Boolean compulsory;
        private Integer totalMarks;
        private Integer sectionOrder;
        private Boolean shuffleQuestions;

        private List<SectionQuestionDTO> questions;

        /* ===== GETTERS & SETTERS ===== */

        public String getSectionName() { return sectionName; }
        public void setSectionName(String sectionName) { this.sectionName = sectionName; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }

        public String getAttemptType() { return attemptType; }
        public void setAttemptType(String attemptType) { this.attemptType = attemptType; }

        public Integer getAttemptCount() { return attemptCount; }
        public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }

        public Boolean getCompulsory() { return compulsory; }
        public void setCompulsory(Boolean compulsory) { this.compulsory = compulsory; }

        public Integer getTotalMarks() { return totalMarks; }
        public void setTotalMarks(Integer totalMarks) { this.totalMarks = totalMarks; }

        public Integer getSectionOrder() { return sectionOrder; }
        public void setSectionOrder(Integer sectionOrder) { this.sectionOrder = sectionOrder; }

        public Boolean getShuffleQuestions() { return shuffleQuestions; }
        public void setShuffleQuestions(Boolean shuffleQuestions) { this.shuffleQuestions = shuffleQuestions; }

        public List<SectionQuestionDTO> getQuestions() { return questions; }
        public void setQuestions(List<SectionQuestionDTO> questions) { this.questions = questions; }
    }

    /* =====================================================
       SECTION QUESTION DTO (🔥 KEY CHANGE)
       ===================================================== */
    public static class SectionQuestionDTO {

        /* 🔥 FULL QUESTION PAYLOAD (NEW QUESTIONS) */
        private RDQuizQuestionDTO question;

        /* 🔗 EXAM-SPECIFIC MAPPING */
        private Integer marks;
        private Double negativeMarks;
        private Integer displayOrder;

        private Boolean mandatory;
        private Integer internalChoiceGroup;
        private Integer parentQuestionId;
        private String subLabel;

        private Integer maxWordLimit;

        /* ===== GETTERS & SETTERS ===== */

        public RDQuizQuestionDTO getQuestion() { return question; }
        public void setQuestion(RDQuizQuestionDTO question) { this.question = question; }

        public Integer getMarks() { return marks; }
        public void setMarks(Integer marks) { this.marks = marks; }

        public Double getNegativeMarks() { return negativeMarks; }
        public void setNegativeMarks(Double negativeMarks) { this.negativeMarks = negativeMarks; }

        public Integer getDisplayOrder() { return displayOrder; }
        public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

        public Boolean getMandatory() { return mandatory; }
        public void setMandatory(Boolean mandatory) { this.mandatory = mandatory; }

        public Integer getInternalChoiceGroup() { return internalChoiceGroup; }
        public void setInternalChoiceGroup(Integer internalChoiceGroup) { this.internalChoiceGroup = internalChoiceGroup; }

        public Integer getParentQuestionId() { return parentQuestionId; }
        public void setParentQuestionId(Integer parentQuestionId) { this.parentQuestionId = parentQuestionId; }

        public String getSubLabel() { return subLabel; }
        public void setSubLabel(String subLabel) { this.subLabel = subLabel; }

        public Integer getMaxWordLimit() { return maxWordLimit; }
        public void setMaxWordLimit(Integer maxWordLimit) { this.maxWordLimit = maxWordLimit; }
    }
}
