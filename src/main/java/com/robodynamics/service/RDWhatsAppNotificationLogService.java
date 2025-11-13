package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDWhatsAppNotificationLog;
import com.robodynamics.model.RDUser;

public interface RDWhatsAppNotificationLogService {
    void logNotification(RDUser user, String phone, String type, String content, String status, String response);
    List<RDWhatsAppNotificationLog> getAllLogs();
}
