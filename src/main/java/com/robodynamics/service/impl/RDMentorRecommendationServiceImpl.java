package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMentorRecommendationDAO;
import com.robodynamics.model.RDMentorRecommendation;
import com.robodynamics.service.RDMentorRecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RDMentorRecommendationServiceImpl implements RDMentorRecommendationService {

    @Autowired
    private RDMentorRecommendationDAO recommendationDAO;

    @Override
    @Transactional
    public void addRecommendation(RDMentorRecommendation recommendation) {
        recommendationDAO.save(recommendation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMentorRecommendation> getRecommendationsForMentor(Integer mentorId) {
        return recommendationDAO.getRecommendationsByMentor(mentorId);
    }
}
