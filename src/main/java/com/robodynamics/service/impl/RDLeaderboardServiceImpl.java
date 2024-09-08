package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDLeaderboardDao;
import com.robodynamics.model.RDLeaderboard;
import com.robodynamics.service.RDLeaderboardService;

@Service
public class RDLeaderboardServiceImpl implements RDLeaderboardService {

    @Autowired
    private RDLeaderboardDao rdLeaderboardDao;

    @Override
    @Transactional
    public List<RDLeaderboard> findTopUsers(int limit) {
        return rdLeaderboardDao.findTopUsers(limit);
    }

    @Override
    @Transactional
    public RDLeaderboard findByUserId(int userId) {
        return rdLeaderboardDao.findByUserId(userId);
    }

    @Override
    @Transactional
    public List<RDLeaderboard> findAll() {
        return rdLeaderboardDao.findAll();
    }
}
