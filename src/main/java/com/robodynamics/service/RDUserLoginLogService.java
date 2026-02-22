package com.robodynamics.service;

import com.robodynamics.model.RDUser;

public interface RDUserLoginLogService {

    void logSuccessfulLogin(RDUser user, String ipAddress);

    long countDistinctUsersLoggedIn();

    long countDistinctUsersLoggedInToday();

    long countLoginsToday();
}
