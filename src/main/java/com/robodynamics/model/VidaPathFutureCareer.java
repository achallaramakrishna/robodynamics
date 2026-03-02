package com.robodynamics.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "vida_path_future_career")
public class VidaPathFutureCareer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "career_cluster", nullable = false, length = 128)
    private String careerCluster;

    @Column(name = "career_name", nullable = false, length = 256)
    private String careerName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "required_skills", columnDefinition = "TEXT")
    private String requiredSkills;

    @Column(name = "projected_growth_india", length = 128)
    private String projectedGrowthIndia;

    @Column(name = "projected_growth_global", length = 128)
    private String projectedGrowthGlobal;

    @Column(name = "relevant_grades", length = 64)
    private String relevantGrades;

    protected VidaPathFutureCareer() {
        // Hibernate
    }

    public Long getId() {
        return id;
    }

    public String getCareerCluster() {
        return careerCluster;
    }

    public String getCareerName() {
        return careerName;
    }

    public String getDescription() {
        return description;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public String getProjectedGrowthIndia() {
        return projectedGrowthIndia;
    }

    public String getProjectedGrowthGlobal() {
        return projectedGrowthGlobal;
    }

    public String getRelevantGrades() {
        return relevantGrades;
    }
}
