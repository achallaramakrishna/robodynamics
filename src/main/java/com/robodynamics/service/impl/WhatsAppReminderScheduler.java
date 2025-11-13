package com.robodynamics.service.impl;

import java.time.*;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.dao.RDWhatsAppNotificationLogDao;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.WhatsAppService;
import com.robodynamics.service.RDWhatsAppNotificationLogService;

@Service
public class WhatsAppReminderScheduler {

    @Autowired
    private RDCourseOfferingDao courseOfferingDAO;

    @Autowired
    private WhatsAppService whatsAppService;

    @Autowired
    private RDWhatsAppNotificationLogService logService;

    @Autowired
    private RDWhatsAppNotificationLogDao logDao;

    @PostConstruct
    public void init() {
        System.out.println("✅ WhatsAppReminderScheduler initialized");
    }

    /**
     * Runs every 1 minute for testing.
     * Sends WhatsApp reminders 30 minutes before class start.
     */
    @Scheduled(cron = "0 */30 * * * *") // every 1 minute
    public void sendWhatsAppReminders() {
        System.out.println("⏰ Running WhatsApp Reminder Scheduler...");

        LocalDate today = LocalDate.now();
        String todayName = today.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);

        LocalTime now = LocalTime.now();
        LocalTime thirtyMinutesLater = now.plusMinutes(30);

        List<RDCourseOffering> offerings = courseOfferingDAO.findActiveOfferings();
        if (offerings == null || offerings.isEmpty()) {
            System.out.println("⚠️ No active course offerings found today.");
            return;
        }

        System.out.println("📅 Today is " + todayName + " | Checking offerings between " + now + " and " + thirtyMinutesLater);

        for (RDCourseOffering offering : offerings) {
            if (!Boolean.TRUE.equals(offering.getReminderNeeded())) {
                System.out.println("⏩ Skipping offering ID " + offering.getCourseOfferingId() + " (" + offering.getCourseOfferingName() + ") — reminder not required.");
                continue;
            }

            if (offering.getDaysOfWeek() == null) continue;

            List<String> activeDays = Arrays.stream(offering.getDaysOfWeek().split(","))
                    .map(String::trim)
                    .collect(Collectors.toList());
            if (!activeDays.contains(todayName)) continue;

            LocalTime classTime = offering.getSessionStartTime();
            if (classTime == null) continue;

            if (classTime.isAfter(now) && classTime.isBefore(thirtyMinutesLater)) {
                LocalDateTime sessionStart = LocalDateTime.of(today, classTime);
                String courseName = offering.getCourseOfferingName();

                System.out.println("\n============================================");
                System.out.println("🎓 Course Offering Starting Soon!");
                System.out.println("➡️  Offering ID: " + offering.getCourseOfferingId());
                System.out.println("➡️  Course Name: " + courseName);
                System.out.println("🕒  Session Start Time: " + classTime);
                System.out.println("============================================");

                /* ============ 1️⃣ MENTOR REMINDER ============ */
                RDUser mentor = offering.getInstructor();
                if (mentor != null) {
                    String phone = mentor.getCellPhone();
                    if (!Boolean.TRUE.equals(mentor.getWantsNotifications())) {
                        System.out.println("🚫 Mentor " + mentor.getFirstName() + " has notifications OFF (settings).");
                    } else if (phone == null || phone.isEmpty()) {
                        System.out.println("⚠️ Mentor " + mentor.getFirstName() + " has no valid phone number.");
                    } else {
                        boolean alreadySent = logDao.existsForToday(offering.getCourseOfferingId(), phone, "CLASS_REMINDER_MENTOR");
                        if (alreadySent) {
                            System.out.println("🟡 Mentor reminder already sent to " + phone + " today for " + courseName);
                        } else {
                            try {
                                System.out.println("📲 Sending mentor reminder to " + phone + "...");
                                whatsAppService.sendClassReminderMentor(
                                        offering.getCourseOfferingId(),
                                        courseName,
                                        sessionStart,
                                        phone
                                );
                                logService.logNotification(
                                        mentor,
                                        phone,
                                        "CLASS_REMINDER_MENTOR",
                                        "Offering ID: " + offering.getCourseOfferingId() +
                                                ", Course: " + courseName + ", Time: " + sessionStart,
                                        "SENT",
                                        "Success"
                                );
                                System.out.println("✅ Mentor reminder sent successfully to " + mentor.getFirstName() + " (" + phone + ")");
                            } catch (Exception e) {
                                logService.logNotification(
                                        mentor,
                                        phone,
                                        "CLASS_REMINDER_MENTOR",
                                        "Offering ID: " + offering.getCourseOfferingId(),
                                        "FAILED",
                                        e.getMessage()
                                );
                                System.out.println("❌ Failed to send mentor reminder: " + e.getMessage());
                            }
                        }
                    }
                } else {
                    System.out.println("⚠️ No mentor assigned for this course offering.");
                }

                /* ============ 2️⃣ PARENT REMINDERS ============ */
                if (offering.getStudentEnrollments() != null && !offering.getStudentEnrollments().isEmpty()) {
                    for (RDStudentEnrollment enrollment : offering.getStudentEnrollments()) {
                        RDUser parent = enrollment.getParent();
                        RDUser student = enrollment.getStudent();

                        if (parent == null) continue;
                        String phone = parent.getCellPhone();

                        if (!Boolean.TRUE.equals(parent.getWantsNotifications())) {
                            System.out.println("🚫 Parent " + parent.getFirstName() + " has notifications OFF (settings).");
                            continue;
                        }
                        if (phone == null || phone.isEmpty()) {
                            System.out.println("⚠️ Parent " + parent.getFirstName() + " has no valid phone number.");
                            continue;
                        }

                        boolean alreadySent = logDao.existsForToday(offering.getCourseOfferingId(), phone, "CLASS_REMINDER_PARENT");
                        if (alreadySent) {
                            System.out.println("🟡 Parent reminder already sent to " + phone + " today for " + courseName);
                            continue;
                        }

                        String studentName = (student != null) ? student.getFirstName() : "your child";

                        try {
                            System.out.println("📲 Sending parent reminder to " + parent.getFirstName() + " (" + phone + ") for student " + studentName + "...");
                            whatsAppService.sendClassReminderStudent(
                                    enrollment.getEnrollmentId(),
                                    studentName,
                                    courseName,
                                    sessionStart,
                                    phone
                            );

                            logService.logNotification(
                                    parent,
                                    phone,
                                    "CLASS_REMINDER_PARENT",
                                    "Offering ID: " + offering.getCourseOfferingId() +
                                            ", Student: " + studentName + ", Course: " + courseName +
                                            ", Time: " + sessionStart,
                                    "SENT",
                                    "Success"
                            );
                            System.out.println("✅ Parent reminder sent successfully to " + parent.getFirstName() + " (" + phone + ")");
                        } catch (Exception e) {
                            logService.logNotification(
                                    parent,
                                    phone,
                                    "CLASS_REMINDER_PARENT",
                                    "Offering ID: " + offering.getCourseOfferingId(),
                                    "FAILED",
                                    e.getMessage()
                            );
                            System.out.println("❌ Failed to send parent reminder to " + phone + ": " + e.getMessage());
                        }
                    }
                } else {
                    System.out.println("⚠️ No student enrollments found for this offering.");
                }
            }
        }

        System.out.println("✅ WhatsApp reminder scheduler cycle complete.\n");
    }
}
