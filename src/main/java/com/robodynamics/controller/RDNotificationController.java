package com.robodynamics.controller;

import com.robodynamics.service.RDNotificationService;
import com.robodynamics.model.RDNotification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/manager/notifications")
public class RDNotificationController {

	@Autowired
    private RDNotificationService notificationService;

    // Get the list of latest notifications for a user (Admin, Mentor, Parent)
    @GetMapping
    public String listNotifications(Model model, @SessionAttribute("currentUserId") int userId) {
    	
    	// Fetch the count of unread notifications
        int unreadCount = notificationService.getUnreadCount(userId);
        model.addAttribute("unreadCount", unreadCount);
        
        List<RDNotification> notifications = notificationService.getLatestNotifications(userId, 50);
        model.addAttribute("notifications", notifications);
        return "manager/notifications"; // the view name
    }

    // Mark a specific notification as read
    @PostMapping("/{id}/read")
    public String markAsRead(@PathVariable int id, @SessionAttribute("currentUserId") int userId) {
        notificationService.markAsRead(id, userId);
        return "redirect:/manager/notifications";
    }
}
