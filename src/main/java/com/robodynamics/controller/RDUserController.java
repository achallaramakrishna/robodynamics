package com.robodynamics.controller;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.dto.RDStudentAttendanceDTO;
import com.robodynamics.model.RDClassSession;
import com.robodynamics.model.RDContact;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseTracking;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDClassAttendanceService;
import com.robodynamics.service.RDClassSessionService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDCourseTrackingService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;

import java.sql.Date;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class RDUserController {
	
    private static final Logger log = LoggerFactory.getLogger(RDUserController.class);

	
	
	@Autowired
	private RDClassSessionService classSessionService;
	
	
	@Autowired
	private RDCourseOfferingService courseOfferingService;

	@Autowired
	private RDClassAttendanceService attendanceService;

	@Autowired
	private RDCourseTrackingService trackingService;
	
	@Autowired
	private RDCourseService courseService;
	
	@Autowired
	private RDCourseSessionService courseSessionService;
	
	@Autowired
	private RDStudentEnrollmentService enrollmentService;

	@Autowired
	private RDUserService userService;
	
	@Autowired
	private RDCourseTrackingService courseTrackingService;

	@GetMapping("/register")	
	public ModelAndView home(Model m) {
		RDUser rdUser = new RDUser();
		m.addAttribute("rdUser", rdUser);
		ModelAndView modelAndView = new ModelAndView("register");
		return modelAndView;
	}

	@GetMapping("/listusers")
	public ModelAndView listusers(Model m) {
		RDUser rdUser = new RDUser();
		m.addAttribute("rdUser", rdUser);
		List < RDUser > rdUserList = userService.getRDUsers();
		m.addAttribute("rdUserList", rdUserList);
		ModelAndView modelAndView = new ModelAndView("manageusers");
		return modelAndView;
	}

	@PostMapping("/search")
	public ModelAndView search(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
		List < RDUser > rdUserList = userService.searchUsers(rdUser.getProfile_id(),rdUser.getActive());
		model.addAttribute("rdUserList", rdUserList);
		ModelAndView modelAndView = new ModelAndView("manageusers");
		return modelAndView;
	}
	
	@PostMapping("/register")
	public String register(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
		userService.registerRDUser(rdUser);
		model.addAttribute("success", "Registered Successfully");
		return "login";
	}
	
	@GetMapping("/contactus")
	public String register(@ModelAttribute("rdContact") RDContact rdContact, Model model) {
		
		model.addAttribute(new RDContact());
		return "contactus";
	}
	

	@GetMapping("/login")
	public String loginDisplay(Model m, HttpSession session) {

		RDUser rdUser = new RDUser();

		/*
		 * if (session.getAttribute("rdUser") != null) { session.invalidate();
		 * System.out.println("here"); m.addAttribute("success",
		 * "You have logout Successfully!!!"); }
		 */
		m.addAttribute("rdUser", rdUser);
		return "login";
	}
	
	@GetMapping("/logout")
	public String logout(Model m, HttpSession session) {

		RDUser rdUser = new RDUser();

		if (session.getAttribute("rdUser") != null) {
			session.invalidate();
			System.out.println("here");
			m.addAttribute("success", "You have logout Successfully!!!");
		}
		m.addAttribute("rdUser", rdUser);
		return "login";
	}
	
	@PostMapping("/login")
    public String login(@ModelAttribute("rdUser") RDUser rdUser, Model model, HttpSession session) {
        try {
            // Try the existing auth flow
        	System.out.println(rdUser.getUserName() + " " + rdUser.getPassword());
            RDUser authenticated = userService.loginRDUser(rdUser);
            if (authenticated != null) {
                model.addAttribute("rdUser", authenticated);
                session.setAttribute("rdUser", authenticated);
                log.info("Login success for username='{}', userId={}", safe(rdUser.getUserName()), authenticated.getUserID());

                String redirectUrl = (String) session.getAttribute("redirectUrl");
                if (redirectUrl != null) {
                    session.removeAttribute("redirectUrl");
                    return "redirect:" + redirectUrl;
                }

                if (authenticated.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
                    return "redirect:/parent/dashboard";
                } else if (authenticated.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
                    return "redirect:/studentDashboard";
                } else if (authenticated.getProfile_id() == RDUser.profileType.ROBO_MENTOR.getValue()) {
                    return "redirect:/mentor/dashboard"; // <-- Mentor dashboard
                }else {
                    return "redirect:/dashboard";
                }
            } else {
            	System.out.println("not authenticated");
            }

            // If we reach here, login failed. Try to refine the reason (optional, if you have these APIs).
            String username = rdUser.getUserName();
            RDUser byName = userService.findByUserName(username); // <-- add this in your service/DAO if not present
            if (byName == null) {
                log.warn("Login failed: username not found. username='{}'", safe(username));
                model.addAttribute("error", "No account found with that username.");
                model.addAttribute("errorDetail", "Check for typos or create a new account.");
            } else if (byName.getActive() == 0) {
                log.warn("Login failed: account inactive. username='{}'", safe(username));
                model.addAttribute("error", "Your account is inactive.");
                model.addAttribute("errorDetail", "Please contact the administrator to activate your account.");
            } else {
                log.warn("Login failed: invalid password. username='{}'", safe(username));
                model.addAttribute("error", "Incorrect password.");
                model.addAttribute("errorDetail", "If you forgot your password, use the 'Forgot password' link.");
            }

        } catch (Exception ex) {
            log.error("Unexpected error during login for username='{}'", safe(rdUser.getUserName()), ex);
            model.addAttribute("error", "Something went wrong while signing you in.");
            model.addAttribute("errorDetail", "Please try again in a moment.");
        }

        // Return to login page with error messages set
        // Also retain the username so the user doesn’t have to type it again
        model.addAttribute("rdUser", rdUser);
        return "login";
    }

    private String safe(String s) {
        return s == null ? "" : s.replaceAll("[\\r\\n]", "");
    }	
	@GetMapping("/dashboard")
	public String homeDashboard() {
	    return "dashboard";  // No DB calls, just loads dashboard
	}



	@PostMapping("/dashboard")
	public String showDashboard(@ModelAttribute("rdUser") RDUser rdUser, Model model) {
	    System.out.println("Inside dashboard");
	    List<RDUser> users = userService.searchUsers(rdUser.getProfile_id(), rdUser.getActive());
	    model.addAttribute("users", users);
	    return "dashboard";
	}
	
	@GetMapping("/attendance-tracking")
	public String viewAttendanceTracking(@RequestParam(value = "date", required = false) String dateParam,
	                                     Model model,
	                                     HttpSession session) {

	    // 1) Parse date
	    LocalDate selectedDate = (dateParam != null && !dateParam.isEmpty())
	            ? LocalDate.parse(dateParam)
	            : LocalDate.now();
	    DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	    model.addAttribute("selectedDateFormatted", selectedDate.format(inputFormatter));

	    // 2) Who is logged in?
	    RDUser current = (RDUser) session.getAttribute("rdUser"); // you set this on login
	    Integer profileId = (current != null) ? current.getProfile_id() : null;
	    Integer userId = (current != null) ? current.getUserID() : null;

	    // 3) Fetch offerings by role
	    List<RDCourseOffering> todayOfferings;

	    boolean isAdmin =
	            profileId != null && (
	                profileId == RDUser.profileType.SUPER_ADMIN.getValue()
	             || profileId == RDUser.profileType.ROBO_ADMIN.getValue()
	             || profileId == RDUser.profileType.ROBO_FINANCE_ADMIN.getValue() // if they should also see all
	            );

	    boolean isMentor =
	            profileId != null && (
	                profileId == RDUser.profileType.ROBO_MENTOR.getValue()
	            );

	    if (isAdmin) {
	        todayOfferings = courseOfferingService.getCourseOfferingsByDate(selectedDate);
	    } else if (isMentor) {
	        todayOfferings = courseOfferingService.getCourseOfferingsByDateAndMentor(selectedDate, userId);
	    } else {
	        // parents/students or unknown → show nothing (or your desired behavior)
	        todayOfferings = Collections.emptyList();
	    }

	    System.out.println("✅ Controller received offerings: " + todayOfferings.size());
	    todayOfferings.forEach(o -> System.out.println("Offering: " + o.getCourse().getCourseName()));

	    Map<Integer, List<RDUser>> enrolledStudentsMap = new HashMap<>();
	    Map<Integer, List<RDCourseSession>> courseSessionsMap = new HashMap<>();
	    Map<Integer, Map<Integer, String>>  attendanceStatusMap = new HashMap<>();
	    Map<Integer, Map<Integer, Boolean>> trackingStatusMap   = new HashMap<>();
	    Map<Integer, Map<Integer, String>>  trackingFeedbackMap = new HashMap<>();
	    Map<Integer, Map<Integer, Integer>> trackingSessionMap  = new HashMap<>();

	    for (RDCourseOffering offering : todayOfferings) {
	        int offeringId = offering.getCourseOfferingId();
	        System.out.println("offering id - " + offeringId);

	        // Enrolled students
	        List<RDUser> students = userService.getEnrolledStudents(offeringId)
	                                           .stream().distinct().collect(Collectors.toList());
	        System.out.println("👩‍🎓 Enrolled in " + offering.getCourse().getCourseName() + ": " + students.size());
	        students.forEach(s -> System.out.println(" - " + s.getUserID() + " " + s.getUserName()));
	        enrolledStudentsMap.put(offeringId, students);

	        // Sessions
	        List<RDCourseSession> sessions = courseSessionService.getCourseSessionsByCourseOfferingId(offeringId);
	        courseSessionsMap.put(offeringId, sessions);

	        // Status maps
	        Map<Integer, String>  studentAttendanceMap = new HashMap<>();
	        Map<Integer, Boolean> studentTrackingMap   = new HashMap<>();
	        Map<Integer, String>  studentFeedbackMap   = new HashMap<>();
	        Map<Integer, Integer> studentSessionMap    = new HashMap<>();

	        for (RDUser student : students) {
	            String status = attendanceService.getAttendanceStatusForStudent(offeringId, student.getUserID(), selectedDate);
	            studentAttendanceMap.put(student.getUserID(), status != null ? status : "");

	            System.out.println("hello 1 - Offering id - " + offeringId + "User id : " + student.getUserID());

	            Integer enrollmentId = enrollmentService.findEnrollmentIdByStudentAndOffering(offeringId, student.getUserID());
	            System.out.println("🟢 Enrollment ID for student " + student.getUserID() + ": " + enrollmentId);

	            if (enrollmentId != null) {
	                RDCourseTracking tracking = courseTrackingService.findByEnrollmentAndDate(enrollmentId, selectedDate);
	                if (tracking != null) {
	                    Integer sessionId = (tracking.getCourseSession() != null)
	                            ? tracking.getCourseSession().getCourseSessionId()
	                            : null;

	                    System.out.println("✅ Tracking found for student " + student.getUserID() +
	                            " | Feedback: " + tracking.getFeedback() +
	                            " | Session ID: " + sessionId);

	                    studentTrackingMap.put(student.getUserID(), true);
	                    studentFeedbackMap.put(student.getUserID(), tracking.getFeedback());
	                    studentSessionMap.put(student.getUserID(), sessionId);
	                } else {
	                    System.out.println("⚠️ No tracking found for enrollment " + enrollmentId);
	                    studentTrackingMap.put(student.getUserID(), false);
	                    studentFeedbackMap.put(student.getUserID(), "");
	                    studentSessionMap.put(student.getUserID(), null);
	                }
	            } else {
	                System.out.println("⚠️ No enrollment found for student " + student.getUserID());
	                studentTrackingMap.put(student.getUserID(), false);
	                studentFeedbackMap.put(student.getUserID(), "");
	                studentSessionMap.put(student.getUserID(), null);
	            }
	        }

	        attendanceStatusMap.put(offeringId, studentAttendanceMap);
	        trackingStatusMap.put(offeringId, studentTrackingMap);
	        trackingFeedbackMap.put(offeringId, studentFeedbackMap);
	        trackingSessionMap.put(offeringId, studentSessionMap);
	    }

	    model.addAttribute("todayOfferings", todayOfferings);
	    model.addAttribute("enrolledStudentsMap", enrolledStudentsMap);
	    model.addAttribute("courseSessionsMap", courseSessionsMap);
	    model.addAttribute("attendanceStatusMap", attendanceStatusMap);
	    model.addAttribute("trackingStatusMap", trackingStatusMap);
	    model.addAttribute("trackingFeedbackMap", trackingFeedbackMap);
	    model.addAttribute("trackingSessionMap", trackingSessionMap);

	    return "attendance-tracking";
	}




	@GetMapping("/attendance-tracking/calendar")
	@ResponseBody
	public List<Map<String, Object>> getCalendarEvents(
	        @RequestParam(required = false) Long courseId,
	        @RequestParam(required = false) Long mentorId,
	        @RequestParam(required = false) String status) {

	    List<RDCourseOffering> offerings = courseOfferingService.getFilteredOfferings(courseId, mentorId, status);

	    List<Map<String, Object>> events = new ArrayList<>();
	    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

	    for (RDCourseOffering offering : offerings) {
	        Map<String, Object> event = new HashMap<>();

	        // Title: Course + Mentor + Status
	        String mentorName = (offering.getInstructor() != null) ? 
	                             offering.getInstructor().getFirstName() : "Unknown Mentor";
	        String eventTitle = offering.getCourse().getCourseName() + " - " + mentorName;
	        if (offering.getStatus() != null && !offering.getStatus().isEmpty()) {
	            eventTitle += " (" + offering.getStatus() + ")";
	        }

	        event.put("id", offering.getCourseOfferingId());
	        event.put("title", eventTitle);

	        // Ensure correct format for FullCalendar
	        if (offering.getSessionStartTime() != null) {
	            event.put("start", offering.getSessionStartTime().format(formatter));
	        }
	        if (offering.getSessionEndTime() != null) {
	            event.put("end", offering.getSessionEndTime().format(formatter));
	        }

	        // Optional extra info for modals
	        event.put("mentor", mentorName);
	        event.put("courseId", offering.getCourse().getCourseId());
	        event.put("status", offering.getStatus());

	        events.add(event);
	    }
	    return events;
	}

}