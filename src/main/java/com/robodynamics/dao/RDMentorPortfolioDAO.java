package com.robodynamics.dao;

import com.robodynamics.model.RDMentorPortfolio;
import java.util.List;

public interface RDMentorPortfolioDAO {
    void save(RDMentorPortfolio portfolio);
    List<RDMentorPortfolio> getPortfoliosByMentor(Integer mentorId);
    void delete(Integer portfolioId);
}
