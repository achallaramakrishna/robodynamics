package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDUserPoints;

public interface RDUserPointsDao {

    // Create or update user points
    void saveOrUpdate(RDUserPoints userPoints);

    // Get total points for a specific user
    RDUserPoints findByUserId(int userId);

    // Get all users with their points (useful for leaderboards)
    List<RDUserPoints> findAll();

    // Delete user points (if necessary)
    void delete(RDUserPoints userPoints);
}
