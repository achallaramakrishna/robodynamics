package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDWhatsAppNotificationLogDao;
import com.robodynamics.model.RDWhatsAppNotificationLog;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDWhatsAppNotificationLogService;

@Service
public class RDWhatsAppNotificationLogServiceImpl implements RDWhatsAppNotificationLogService {

    @Autowired
    private RDWhatsAppNotificationLogDao logDao;

    @Override
    public void logNotification(RDUser user, String phone, String type, String content, String status, String response) {
        RDWhatsAppNotificationLog log = new RDWhatsAppNotificationLog(user, phone, type, content, status, response);
        logDao.save(log);
    }

    @Override
    public List<RDWhatsAppNotificationLog> getAllLogs() {
        return logDao.findAll();
    }
}
