package com.robodynamics.service.impl;

import com.robodynamics.model.RDNotification;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDNotificationService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.dao.RDNotificationDao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RDNotificationServiceImpl implements RDNotificationService {

	@Autowired
	private RDNotificationDao notificationDao;
	
	@Autowired
	private RDUserService userService;

   

    // Implementing the method to create a new notification
    @Transactional
    @Override
    public void createNotification(int userId, String title, String body, String linkUrl) {
        
    	RDUser user = userService.getRDUser(userId);
    	RDNotification notification = new RDNotification();
        notification.setUser(user);  // Set the userId for the notification
        notification.setTitle(title);
        notification.setBody(body);
        notification.setLinkUrl(linkUrl);

        // Save the notification to the database
        notificationDao.save(notification);
    }

    // Implementing the method to get unread notifications count for a user
    @Transactional(readOnly = true)
    @Override
    public int getUnreadCount(int userId) {
        return notificationDao.countUnread(userId);
    }

    // Implementing the method to get the latest notifications for a user
    @Transactional(readOnly = true)
    @Override
    public List<RDNotification> getLatestNotifications(int userId, int limit) {
        return notificationDao.latest(userId, limit);
    }

    // Implementing the method to mark a notification as read
    @Transactional
    @Override
    public void markAsRead(int notificationId, int userId) {
        notificationDao.markRead(notificationId, userId);
    }
    
    @Override
    @Transactional
    public int countUnreadNotifications(int userId) {
        return notificationDao.countUnreadNotifications(userId);
    }
}
