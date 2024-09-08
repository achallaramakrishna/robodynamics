package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDBadge;

public interface RDBadgeService {

    // Create or update a badge
    void saveOrUpdate(RDBadge badge);

    // Find badge by its ID
    RDBadge findById(int badgeId);

    // Find all available badges
    List<RDBadge> findAll();

    // Delete a badge
    void delete(RDBadge badge);
}
