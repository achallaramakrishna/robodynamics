package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDMentorPayout;

public interface RDMentorPayoutDao {
    void save(RDMentorPayout payout);
    void update(RDMentorPayout payout);
    void delete(Integer payoutId);
    RDMentorPayout findById(Integer payoutId);
    List<RDMentorPayout> findAll();
}
