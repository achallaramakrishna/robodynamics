package com.robodynamics.service;

import com.robodynamics.model.RDMentorFeedback;
import java.util.List;

public interface RDMentorFeedbackService {
    void addFeedback(RDMentorFeedback feedback);
    List<RDMentorFeedback> getFeedbacksForMentor(Integer mentorId);
    Double getAverageRating(Integer mentorId);
}
