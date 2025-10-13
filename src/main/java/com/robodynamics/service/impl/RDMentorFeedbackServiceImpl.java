package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMentorFeedbackDAO;
import com.robodynamics.model.RDMentorFeedback;
import com.robodynamics.service.RDMentorFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RDMentorFeedbackServiceImpl implements RDMentorFeedbackService {

    @Autowired
    private RDMentorFeedbackDAO feedbackDAO;

    @Override
    @Transactional
    public void addFeedback(RDMentorFeedback feedback) {
        feedbackDAO.save(feedback);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMentorFeedback> getFeedbacksForMentor(Integer mentorId) {
        return feedbackDAO.getFeedbacksByMentor(mentorId);
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageRating(Integer mentorId) {
        return feedbackDAO.getAverageRating(mentorId);
    }
}
