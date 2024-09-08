package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDUserBadge;

public interface RDUserBadgeDao {

    // Create or update a user badge record
    void saveOrUpdate(RDUserBadge userBadge);

    // Find all badges for a specific user
    List<RDUserBadge> findByUserId(int userId);

    // Find all user badges
    List<RDUserBadge> findAll();

    // Delete a user badge record
    void delete(RDUserBadge userBadge);
}

