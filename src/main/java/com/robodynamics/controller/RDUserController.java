package com.robodynamics.controller;

import javax.servlet.http.HttpSession;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class RDUserController {
	
	
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
		
		RDUser rdUser2 = userService.loginRDUser(rdUser);
		if (rdUser2 != null) {
			model.addAttribute("rdUser", rdUser2);
			session.setAttribute("rdUser", rdUser2);
			System.out.println("user is in session");
			
			 // Check if there is a redirect URL saved from before login
			
	        String redirectUrl = (String) session.getAttribute("redirectUrl");
			System.out.println("Redirect url - " + redirectUrl);

	        if (redirectUrl != null) {
	            session.removeAttribute("redirectUrl");  // Clear the redirect URL from session
	            return "redirect:" + redirectUrl;  // Redirect back to the original URL (quiz)
	        }
	        
			
			 if (rdUser2.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue()) {
		            return "redirect:/parentDashboard";  // Redirect to parentDashboard
		        } else if (rdUser2.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
		            return "redirect:/studentDashboard";  // Redirect to studentDashboard
		        } else {
		            return "redirect:/dashboard";
		        }
		}
		
		if (rdUser2 == null) {
			System.out.println("on");
			model.addAttribute("error", "Invalid Credentials");
		}
		
		return "login";

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
			Model model) {
		  // ✅ Parse the selected date or use today's date
	    LocalDate selectedDate = (dateParam != null && !dateParam.isEmpty())
	            ? LocalDate.parse(dateParam)
	            : LocalDate.now();
	 
	    // ✅ Format date for HTML input type="date"
	    DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
	    model.addAttribute("selectedDateFormatted", selectedDate.format(inputFormatter));

	    
	    // ✅ Get today's offerings
	    List<RDCourseOffering> todayOfferings = courseOfferingService.getCourseOfferingsByDate(selectedDate);

	    System.out.println("✅ Controller received offerings: " + todayOfferings.size());
	    todayOfferings.forEach(o -> System.out.println("Offering: " + o.getCourse().getCourseName()));

	    Map<Integer, List<RDUser>> enrolledStudentsMap = new HashMap<>();
	    Map<Integer, List<RDCourseSession>> courseSessionsMap = new HashMap<>();
	    Map<Integer, Map<Integer, String>> attendanceStatusMap = new HashMap<>(); // offeringId → {userId → "Present"/"Absent"/""}
	    Map<Integer, Map<Integer, Boolean>> trackingStatusMap = new HashMap<>();   // offeringId → {userId → trackingFilled}
	    Map<Integer, Map<Integer, String>> trackingFeedbackMap = new HashMap<>();  // offeringId → {userId → feedbackText}
	    Map<Integer, Map<Integer, Integer>> trackingSessionMap = new HashMap<>();  // offeringId → {userId → feedbackText}
	    

	    for (RDCourseOffering offering : todayOfferings) {
	        int offeringId = offering.getCourseOfferingId();
	        System.out.println("offering id - " + offeringId);

	        // ✅ Fetch enrolled students
	        List<RDUser> students = userService.getEnrolledStudents(offeringId)
	                                           .stream()
	                                           .distinct()
	                                           .collect(Collectors.toList());
	        System.out.println("👩‍🎓 Enrolled in " + offering.getCourse().getCourseName() + ": " + students.size());
	        students.forEach(s -> System.out.println(" - " + s.getUserID() + " " + s.getUserName()));
	        enrolledStudentsMap.put(offeringId, students);

	        // ✅ Fetch sessions
	        List<RDCourseSession> sessions = courseSessionService.getCourseSessionsByCourseOfferingId(offeringId);
	        courseSessionsMap.put(offeringId, sessions);

	        // ✅ Attendance & Tracking status maps
	        Map<Integer, String> studentAttendanceMap = new HashMap<>();
	        Map<Integer, Boolean> studentTrackingMap = new HashMap<>();
	        Map<Integer, String> studentFeedbackMap = new HashMap<>();

	        Map<Integer, Integer> studentSessionMap = new HashMap<>();
	        

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