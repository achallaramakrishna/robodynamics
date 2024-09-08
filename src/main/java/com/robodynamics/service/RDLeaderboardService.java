package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDLeaderboard;

public interface RDLeaderboardService {

    // Get the top users based on their points
    List<RDLeaderboard> findTopUsers(int limit);

    // Get a user's position in the leaderboard
    RDLeaderboard findByUserId(int userId);

    // Get all users in the leaderboard
    List<RDLeaderboard> findAll();
}
