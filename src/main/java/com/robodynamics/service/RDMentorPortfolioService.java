package com.robodynamics.service;

import com.robodynamics.model.RDMentorPortfolio;
import java.util.List;

public interface RDMentorPortfolioService {
    void addOrUpdatePortfolio(RDMentorPortfolio portfolio);
    List<RDMentorPortfolio> getPortfoliosForMentor(Integer mentorId);
    void deletePortfolio(Integer portfolioId);
}
