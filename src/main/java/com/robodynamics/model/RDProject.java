package com.robodynamics.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_projects")
public class RDProject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private int projectId;

    @Column(name = "is_featured", nullable = false)
    private boolean isFeatured;

    // Getters and Setters

    public boolean isFeatured() {
        return isFeatured;
    }

    public void setFeatured(boolean isFeatured) {
        this.isFeatured = isFeatured;
    }
    public int getProjectId() {
		return projectId;
	}

	public void setProjectId(int projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public int getGradeLevel() {
		return gradeLevel;
	}

	public void setGradeLevel(int gradeLevel) {
		this.gradeLevel = gradeLevel;
	}

	public GradeRange getGradeRange() {
		return gradeRange;
	}

	public void setGradeRange(GradeRange gradeRange) {
		this.gradeRange = gradeRange;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public String getDetailedDescription() {
		return detailedDescription;
	}

	public void setDetailedDescription(String detailedDescription) {
		this.detailedDescription = detailedDescription;
	}

	public DifficultyLevel getDifficultyLevel() {
		return difficultyLevel;
	}

	public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
		this.difficultyLevel = difficultyLevel;
	}

	public String getEstimatedDuration() {
		return estimatedDuration;
	}

	public void setEstimatedDuration(String estimatedDuration) {
		this.estimatedDuration = estimatedDuration;
	}

	public String getMaterialsRequired() {
		return materialsRequired;
	}

	public void setMaterialsRequired(String materialsRequired) {
		this.materialsRequired = materialsRequired;
	}

	public String getSteps() {
		return steps;
	}

	public void setSteps(String steps) {
		this.steps = steps;
	}

	public String getVideoLink() {
		return videoLink;
	}

	public void setVideoLink(String videoLink) {
		this.videoLink = videoLink;
	}

	public String getImageLink() {
		return imageLink;
	}

	public void setImageLink(String imageLink) {
		this.imageLink = imageLink;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	@Column(name = "project_name", nullable = false)
    private String projectName;

    @Column(name = "grade_level", nullable = false)
    private int gradeLevel;

    @Column(name = "grade_range", nullable = false)	
    @Enumerated(EnumType.STRING)
    private GradeRange gradeRange;

    public enum GradeRange {
        LOWER_PRIMARY_1_3("Lower Primary (1-3)"),
        UPPER_PRIMARY_4_6("Upper Primary (4-6)"),
        MIDDLE_SCHOOL_7_9("Middle School (7-9)"),
        HIGH_SCHOOL_10_12("High School (10-12)");

        private final String displayName;

        GradeRange(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
    
    // Helper to get display name for JSP
    public String getGradeRangeDisplayName() {
        return gradeRange != null ? gradeRange.getDisplayName() : "";
    }
    
    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "short_description", length = 500)
    private String shortDescription;

    @Column(name = "detailed_description", columnDefinition = "TEXT")
    private String detailedDescription;

    @Column(name = "difficulty_level", nullable = false)
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    public enum DifficultyLevel {
        Easy, Medium, Hard
    }

    @Column(name = "estimated_duration")
    private String estimatedDuration;

    @Column(name = "materials_required", columnDefinition = "TEXT")
    private String materialsRequired;

    @Column(name = "steps", columnDefinition = "TEXT")
    private String steps;

    @Column(name = "video_link")
    private String videoLink;

    @Column(name = "image_link")
    private String imageLink;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

	@Override
	public String toString() {
		return "RDProject [projectId=" + projectId + ", projectName=" + projectName + ", gradeLevel=" + gradeLevel
				+ ", gradeRange=" + gradeRange + ", category=" + category + ", shortDescription=" + shortDescription
				+ ", detailedDescription=" + detailedDescription + ", difficultyLevel=" + difficultyLevel
				+ ", estimatedDuration=" + estimatedDuration + ", materialsRequired=" + materialsRequired + ", steps="
				+ steps + ", videoLink=" + videoLink + ", imageLink=" + imageLink + ", createdAt=" + createdAt
				+ ", updatedAt=" + updatedAt + "]";
	}

    
}
