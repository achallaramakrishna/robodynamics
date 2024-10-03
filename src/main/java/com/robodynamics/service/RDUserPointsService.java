package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserPoints;

public interface RDUserPointsService {

    // Create or update user points
    void saveOrUpdate(RDUserPoints userPoints);

    // Get total points for a specific user
    RDUserPoints findByUserId(int userId);

    // Get all users with their points (useful for leaderboards)
    List<RDUserPoints> findAll();

    // Delete user points (if necessary)
    void delete(RDUserPoints userPoints);
    
 // Add points to the user's total points
    void addPoints(RDUser user, int points);
    
    // Find points by user ID
    int findPointsByUserId(int userId);
    
    public int calculateTotalPointsByUser(int userId);

    
}
