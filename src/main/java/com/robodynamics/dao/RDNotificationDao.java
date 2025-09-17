package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDNotification;

public interface RDNotificationDao {
	
		  void save(RDNotification n);
		  int countUnread(int userId);
		  List<RDNotification> latest(int userId, int limit);
		  void markRead(int notifId, int userId);
		  
		  int countUnreadNotifications(int userId);


}
