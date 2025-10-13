package com.robodynamics.dao;

import com.robodynamics.model.RDMentorFeedback;
import java.util.List;

public interface RDMentorFeedbackDAO {
    void save(RDMentorFeedback feedback);
    List<RDMentorFeedback> getFeedbacksByMentor(Integer mentorId);
    Double getAverageRating(Integer mentorId);
}
