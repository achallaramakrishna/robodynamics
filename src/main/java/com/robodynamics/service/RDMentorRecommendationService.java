package com.robodynamics.service;

import com.robodynamics.model.RDMentorRecommendation;
import java.util.List;

public interface RDMentorRecommendationService {
    void addRecommendation(RDMentorRecommendation recommendation);
    List<RDMentorRecommendation> getRecommendationsForMentor(Integer mentorId);
}
