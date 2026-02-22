package com.robodynamics.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDUserLoginLogDao;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDUserLoginLog;
import com.robodynamics.service.RDUserLoginLogService;

@Service
public class RDUserLoginLogServiceImpl implements RDUserLoginLogService {

    @Autowired
    private RDUserLoginLogDao loginLogDao;

    @Override
    @Transactional
    public void logSuccessfulLogin(RDUser user, String ipAddress) {
        if (user == null || user.getUserID() == null) {
            return;
        }
        RDUserLoginLog loginLog = new RDUserLoginLog();
        loginLog.setUser(user);
        loginLog.setIpAddress(ipAddress);
        loginLog.setLoginTime(LocalDateTime.now());
        loginLogDao.save(loginLog);
    }

    @Override
    @Transactional(readOnly = true)
    public long countDistinctUsersLoggedIn() {
        return loginLogDao.countDistinctUsersLoggedIn();
    }

    @Override
    @Transactional(readOnly = true)
    public long countDistinctUsersLoggedInToday() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        return loginLogDao.countDistinctUsersLoggedInSince(todayStart);
    }

    @Override
    @Transactional(readOnly = true)
    public long countLoginsToday() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        return loginLogDao.countLoginsSince(todayStart);
    }
}
