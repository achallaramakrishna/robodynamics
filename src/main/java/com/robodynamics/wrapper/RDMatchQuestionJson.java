package com.robodynamics.wrapper;

import java.util.List;

/**
 * Wrapper class for uploading a Match Question along with its pairs via JSON.
 * Used in /matchpairs/uploadJson
 */
public class RDMatchQuestionJson {

    /* ================= QUESTION METADATA ================= */

    private String instructions;
    private String difficultyLevel;
    private Boolean active;

    /* ================= MATCHING PAIRS ================= */

    private List<RDMatchPairJson> pairs;

    /* ================= GETTERS & SETTERS ================= */

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public List<RDMatchPairJson> getPairs() {
        return pairs;
    }

    public void setPairs(List<RDMatchPairJson> pairs) {
        this.pairs = pairs;
    }
}
