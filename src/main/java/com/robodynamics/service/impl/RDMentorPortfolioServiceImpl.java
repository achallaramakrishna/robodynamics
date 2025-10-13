package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMentorPortfolioDAO;
import com.robodynamics.model.RDMentorPortfolio;
import com.robodynamics.service.RDMentorPortfolioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RDMentorPortfolioServiceImpl implements RDMentorPortfolioService {

    @Autowired
    private RDMentorPortfolioDAO portfolioDAO;

    @Override
    @Transactional
    public void addOrUpdatePortfolio(RDMentorPortfolio portfolio) {
        portfolioDAO.save(portfolio);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMentorPortfolio> getPortfoliosForMentor(Integer mentorId) {
        return portfolioDAO.getPortfoliosByMentor(mentorId);
    }

    @Override
    @Transactional
    public void deletePortfolio(Integer portfolioId) {
        portfolioDAO.delete(portfolioId);
    }
}
