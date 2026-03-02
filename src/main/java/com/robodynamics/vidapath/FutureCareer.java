package com.robodynamics.vidapath;

public class FutureCareer {

    private final String careerCluster;
    private final String careerName;
    private final String description;
    private final String requiredSkills;
    private final String projectedGrowthIndia;
    private final String projectedGrowthGlobal;
    private final String relevantGrades;

    public FutureCareer(String careerCluster,
                        String careerName,
                        String description,
                        String requiredSkills,
                        String projectedGrowthIndia,
                        String projectedGrowthGlobal,
                        String relevantGrades) {
        this.careerCluster = careerCluster;
        this.careerName = careerName;
        this.description = description;
        this.requiredSkills = requiredSkills;
        this.projectedGrowthIndia = projectedGrowthIndia;
        this.projectedGrowthGlobal = projectedGrowthGlobal;
        this.relevantGrades = relevantGrades;
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
