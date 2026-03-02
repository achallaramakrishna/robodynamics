package com.robodynamics.vidapath;

import java.util.Collections;
import java.util.List;
import java.util.Map;

public class VidaPathSessionState {

    private final String sessionToken;
    private final Integer studentId;
    private final String gradeBand;
    private final int currentSectionIndex;
    private final List<String> answeredQuestionIds;
    private final Map<String, Double> profileScores;

    public VidaPathSessionState(String sessionToken,
                                Integer studentId,
                                String gradeBand,
                                int currentSectionIndex,
                                List<String> answeredQuestionIds,
                                Map<String, Double> profileScores) {
        this.sessionToken = sessionToken;
        this.studentId = studentId;
        this.gradeBand = gradeBand;
        this.currentSectionIndex = currentSectionIndex;
        this.answeredQuestionIds = List.copyOf(answeredQuestionIds);
        this.profileScores = Map.copyOf(profileScores);
    }

    public String getSessionToken() {
        return sessionToken;
    }

    public Integer getStudentId() {
        return studentId;
    }

    public String getGradeBand() {
        return gradeBand;
    }

    public int getCurrentSectionIndex() {
        return currentSectionIndex;
    }

    public List<String> getAnsweredQuestionIds() {
        return answeredQuestionIds;
    }

    public Map<String, Double> getProfileScores() {
        return profileScores;
    }
}
