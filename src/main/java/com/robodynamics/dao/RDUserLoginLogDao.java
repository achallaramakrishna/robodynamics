package com.robodynamics.dao;

import java.time.LocalDateTime;

import com.robodynamics.model.RDUserLoginLog;

public interface RDUserLoginLogDao {

    void save(RDUserLoginLog loginLog);

    long countDistinctUsersLoggedIn();

    long countDistinctUsersLoggedInSince(LocalDateTime since);

    long countLoginsSince(LocalDateTime since);
}
