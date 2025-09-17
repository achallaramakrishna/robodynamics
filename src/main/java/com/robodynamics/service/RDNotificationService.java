package com.robodynamics.service;

import com.robodynamics.model.RDNotification;
import java.util.List;

public interface RDNotificationService {
    // Save a new notification
    void createNotification(int userId, String title, String body, String linkUrl);

    // Get unread notifications count for a user
    int getUnreadCount(int userId);

    // Get latest notifications for a user
    List<RDNotification> getLatestNotifications(int userId, int limit);

    // Mark notification as read
    void markAsRead(int notificationId, int userId);
    
    int countUnreadNotifications(int userId);
}
