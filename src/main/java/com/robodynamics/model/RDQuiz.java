package com.robodynamics.model;

import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    private String quizType; // e.g., "multiple_choice" or "fill_in_the_blank"

    @Column(name = "time_limit_seconds")
    private int timeLimitSeconds;

    @Column(name = "status")
    private String status;

    @Column(name = "category")
    private String category;

    @Column(name = "is_featured", nullable = false)
    private boolean isFeatured;

    @Column(name = "short_description")
    private String shortDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "grade_range")
    private GradeRange gradeRange;

    @Column(name = "total_questions")
    private Integer totalQuestions;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    // Mapping created_by_user_id to RDUser
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private RDUser createdByUser;

    // Mapping course_id to RDCourse
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id")
    private RDCourse course;

    // Mapping course_session_id to RDCourseSession
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_session_id")
    private RDCourseSession courseSession;

    @ManyToOne
    @JoinColumn(name = "course_session_detail_id", referencedColumnName = "course_session_detail_id")
    private RDCourseSessionDetail courseSessionDetail;
    
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "quiz")
    @JsonIgnore // Prevents the field from being serialized
    private Set<RDQuizQuestionMap> quizQuestionMappings;

    // Enum for GradeRange
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public GradeRange getGradeRange() {
        return gradeRange;
    }

    public void setGradeRange(GradeRange gradeRange) {
        this.gradeRange = gradeRange;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public RDUser getCreatedByUser() {
        return createdByUser;
    }

    public void setCreatedByUser(RDUser createdByUser) {
        this.createdByUser = createdByUser;
    }

    public RDCourse getCourse() {
        return course;
    }

    public void setCourse(RDCourse course) {
        this.course = course;
    }

    public RDCourseSession getCourseSession() {
        return courseSession;
    }

    public void setCourseSession(RDCourseSession courseSession) {
        this.courseSession = courseSession;
    }

    public Set<RDQuizQuestionMap> getQuizQuestionMappings() {
        return quizQuestionMappings;
    }

    public void setQuizQuestionMappings(Set<RDQuizQuestionMap> quizQuestionMappings) {
        this.quizQuestionMappings = quizQuestionMappings;
    }

	public RDCourseSessionDetail getCourseSessionDetail() {
		return courseSessionDetail;
	}

	public void setCourseSessionDetail(RDCourseSessionDetail courseSessionDetail) {
		this.courseSessionDetail = courseSessionDetail;
	}
    
    
}
