package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDUserPoints;

public interface RDUserPointsDao {

    // Create or update user points
    public void saveOrUpdate(RDUserPoints userPoints);

    // Get total points for a specific user
    public RDUserPoints findByUserId(int userId);

    // Get all users with their points (useful for leaderboards)
    public List<RDUserPoints> findAll();

    // Delete user points (if necessary)
    public void delete(RDUserPoints userPoints);
    
    public int calculateTotalPointsByUser(int userId);

}
