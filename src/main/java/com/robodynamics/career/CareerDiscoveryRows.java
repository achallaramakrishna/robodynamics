package com.robodynamics.career;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public final class CareerDiscoveryRows {

    private CareerDiscoveryRows() {
    }

    public static class CareerQuestionRow {
        private final String section;
        private final String questionId;
        private final String questionText;
        private final String type;
        private final List<String> tags;
        private final String adaptivityNotes;

        public CareerQuestionRow(String section, String questionId, String questionText, String type, List<String> tags, String adaptivityNotes) {
            this.section = section;
            this.questionId = questionId;
            this.questionText = questionText;
            this.type = type;
            this.tags = tags;
            this.adaptivityNotes = adaptivityNotes;
        }

        public static CareerQuestionRow fromCsv(String[] columns) {
            if (columns.length < 6) {
                return null;
            }
            List<String> tags = Arrays.stream(columns[4].split(";|,"))
                    .map(String::trim)
                    .filter(tag -> !tag.isEmpty())
                    .collect(Collectors.toList());
            return new CareerQuestionRow(
                    columns[0],
                    columns[1],
                    columns[2],
                    columns[3],
                    tags,
                    columns[5]
            );
        }

        public String getSection() {
            return section;
        }

        public String getQuestionId() {
            return questionId;
        }

        public String getQuestionText() {
            return questionText;
        }

        public String getType() {
            return type;
        }

        public List<String> getTags() {
            return tags;
        }

        public String getAdaptivityNotes() {
            return adaptivityNotes;
        }
    }

    public static class FutureCareerRow {
        private final String cluster;
        private final String name;
        private final String description;
        private final String requiredSkills;
        private final String projectedGrowthIndia;
        private final String projectedGrowthGlobal;
        private final String relevantGrades;

        public FutureCareerRow(String cluster, String name, String description, String requiredSkills,
                               String projectedGrowthIndia, String projectedGrowthGlobal, String relevantGrades) {
            this.cluster = cluster;
            this.name = name;
            this.description = description;
            this.requiredSkills = requiredSkills;
            this.projectedGrowthIndia = projectedGrowthIndia;
            this.projectedGrowthGlobal = projectedGrowthGlobal;
            this.relevantGrades = relevantGrades;
        }

        public static FutureCareerRow fromCsv(String[] columns) {
            if (columns.length < 7) {
                return null;
            }
            return new FutureCareerRow(
                    columns[0],
                    columns[1],
                    columns[2],
                    columns[3],
                    columns[4],
                    columns[5],
                    columns[6]
            );
        }

        public String getCluster() {
            return cluster;
        }

        public String getName() {
            return name;
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
}
