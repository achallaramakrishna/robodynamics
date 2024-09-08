package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserPointsDao;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserPoints;
import com.robodynamics.service.RDUserPointsService;

@Service
public class RDUserPointsServiceImpl implements RDUserPointsService {

    @Autowired
    private RDUserPointsDao rdUserPointsDao;

    @Override
    @Transactional
    public void saveOrUpdate(RDUserPoints userPoints) {
        rdUserPointsDao.saveOrUpdate(userPoints);
    }
    
    @Override
    @Transactional
    public void addPoints(RDUser user, int points) {
        // Find current points for the user
        RDUserPoints userPoints = rdUserPointsDao.findByUserId(user.getUserID());

        if (userPoints == null) {
            // If user has no points record, create a new one
            userPoints = new RDUserPoints();
            userPoints.setUser(user);
            userPoints.setTotalPoints(points); // Set the initial points
            rdUserPointsDao.saveOrUpdate(userPoints);
        } else {
            // If user already has points, update their total points
            int currentPoints = userPoints.getTotalPoints();
            userPoints.setTotalPoints(points);
            rdUserPointsDao.saveOrUpdate(userPoints);  // Update the points in the database
        }
    }

    @Override
    @Transactional
    public int findPointsByUserId(int userId) {
        RDUserPoints userPoints = rdUserPointsDao.findByUserId(userId);
        return userPoints != null ? userPoints.getTotalPoints() : 0;
    }


    @Override
    @Transactional
    public RDUserPoints findByUserId(int userId) {
        return rdUserPointsDao.findByUserId(userId);
    }

    @Override
    @Transactional
    public List<RDUserPoints> findAll() {
        return rdUserPointsDao.findAll();
    }

    @Override
    @Transactional
    public void delete(RDUserPoints userPoints) {
        rdUserPointsDao.delete(userPoints);
    }
}
