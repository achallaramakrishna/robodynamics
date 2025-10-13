package com.robodynamics.dao;

import com.robodynamics.model.RDMentorRecommendation;
import java.util.List;

public interface RDMentorRecommendationDAO {
    void save(RDMentorRecommendation recommendation);
    List<RDMentorRecommendation> getRecommendationsByMentor(Integer mentorId);
}
