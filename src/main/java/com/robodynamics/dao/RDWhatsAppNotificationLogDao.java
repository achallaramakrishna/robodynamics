package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDWhatsAppNotificationLog;

public interface RDWhatsAppNotificationLogDao {
    void save(RDWhatsAppNotificationLog log);
    List<RDWhatsAppNotificationLog> findAll();
    List<RDWhatsAppNotificationLog> findByStatus(String status);
    public boolean existsForToday(int offeringId, String phoneNumber, String messageType);

    
}
