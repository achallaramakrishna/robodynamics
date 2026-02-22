package com.robodynamics.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.robodynamics.form.RDCourseForm;
import com.robodynamics.dto.RDFlashcardSetDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDCourseResource;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.service.RDCourseCategoryService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDFlashCardSetService;
import com.robodynamics.service.RDLabManualService;
import com.robodynamics.service.RDMatchingGameService;
import com.robodynamics.service.RDStudentEnrollmentService;

import java.io.File;
import java.io.IOException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
@RequestMapping("/course")
public class RDCourseController {
	
	private static final Logger log =
	        LoggerFactory.getLogger(RDCourseController.class);

	
	@Autowired
	ServletContext servletContext;
	

	@Autowired
	private RDCourseService service;
	
	@Autowired
	private RDCourseSessionService courseSessionservice;
	

	@Autowired
	private RDCourseCategoryService courseCategoryService;
	
	@Autowired
	private RDStudentEnrollmentService enrollmentService;
	
	@Autowired
	private RDMatchingGameService matchingGameService;
	
	@Autowired
	private RDCourseSessionDetailService courseSessionDetailService;

	@Autowired
	private RDLabManualService labManualService;

	@Autowired
	private RDFlashCardSetService rdFlashCardSetService;

	@GetMapping("/{courseId}/sessions")
    @ResponseBody
    public List<RDCourseSession> getSessionsByCourse(@PathVariable int courseId) {
        return service.findSessionsByCourseId(courseId);
    }
	

    @GetMapping("/details")
    public String getCourseDetails(@RequestParam("courseId") int courseId, Model model) {
        // Fetch course details from the database using the service
        RDCourse course = service.getRDCourse(courseId);

        // Add course details to the model
        model.addAttribute("course", course);

        // Return the JSP page for course details
        return "courseDetails";
    }
	
    @GetMapping("/list")
    public String listCourses(
            @RequestParam(value = "categoryId", required = false) Integer categoryId,
            Model model) {

        List<RDCourse> courses;
        if (categoryId != null && categoryId > 0) {
            courses = service.getCoursesByCategoryId(categoryId);
        } else {
            courses = service.getRDCourses();
        }

        List<RDCourseCategory> categories = courseCategoryService.getRDCourseCategories();

        model.addAttribute("courses", courses);
        model.addAttribute("categories", categories);
        model.addAttribute("selectedCategoryId", categoryId);

        return "listCourses";
    }

	@GetMapping("/showForm")
	public ModelAndView home(Model theModel) {
		
		List < RDCourseCategory > courseCategories = courseCategoryService.getRDCourseCategories();
		theModel.addAttribute("courseCategories", courseCategories);

		theModel.addAttribute("courseForm", new RDCourseForm());
		
		ModelAndView modelAndView = new ModelAndView("course-form");
		return modelAndView;
	}
	
	@GetMapping("/monitor")
	public ModelAndView monitor(Model theModel,
			@RequestParam("courseId") int theId,
			@RequestParam("enrollmentId") int enrollmentId) {
		
		RDCourse course = service.getRDCourse(theId);
		System.out.println("Enrollment id = " + enrollmentId);
		
		RDStudentEnrollment studentEnrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);
		//RDCourse course = service.getRDCourse(theId);
		List <RDCourseSession> courseSessions = courseSessionservice.getCourseSessionsByCourseId(theId);
		
		System.out.println("Size - " + courseSessions.size());
		System.out.println(courseSessions);
	//	System.out.println(courseSessionDetails);
		
		
		//System.out.println("hello....course id............." + course.getCourseId());
		//System.out.println("hello....course name............." + course.getCourseName());
        theModel.addAttribute("courseSessions", courseSessions);
        theModel.addAttribute("studentEnrollment",studentEnrollment);
       
       // theModel.addAttribute("courseSessionDetails", courseSessionDetails);
        ModelAndView modelAndView = null;

        modelAndView = new ModelAndView("showDashboard");
		
        return modelAndView;
	}
	
	
	
	@GetMapping("/monitor/v2")
	public ModelAndView monitorV2(
	        @RequestParam("courseId") int courseId,
	        @RequestParam("enrollmentId") int enrollmentId,
	        Model model) {

	    RDCourse course = service.getRDCourse(courseId);
	    RDStudentEnrollment enrollment =
	            enrollmentService.getRDStudentEnrollment(enrollmentId);

	    List<RDCourseSession> sessions =
	            courseSessionservice.getCourseSessionsByCourseId(courseId);

	    model.addAttribute("course", course);
	    model.addAttribute("courseSessions", sessions);
	    model.addAttribute("studentEnrollment", enrollment);

	    return new ModelAndView("course-monitor-v2"); // NEW JSP
	}
	
	@GetMapping("/session/{sessionId}/dashboard")
	public ModelAndView sessionDashboard(
	        @PathVariable int sessionId,
	        @RequestParam("enrollmentId") int enrollmentId,
	        Model model) {

	    System.out.println("=== SESSION DASHBOARD START ===");
	    System.out.println("sessionId = {}" + sessionId);
	    System.out.println("enrollmentId = {}" + enrollmentId);

	    RDCourseSession session =
	            courseSessionservice.getCourseSession(sessionId);

	    if (session == null) {
	        log.error("❌ No RDCourseSession found for sessionId={}", sessionId);
	    } else {
	        System.out.println("✅ Session found: id={} +  title={}" + 
	                session.getSessionId() + session.getSessionTitle());
	    }

	    RDStudentEnrollment enrollment =
	            enrollmentService.getRDStudentEnrollment(enrollmentId);

	    if (enrollment == null) {
	        log.error("❌ No Enrollment found for enrollmentId={}", enrollmentId);
	    } else {
	        System.out.println("✅ Enrollment found: id={}" +  enrollment.getEnrollmentId());
	    }

	    List<RDCourseSessionDetail> details =
	            courseSessionDetailService.getRDCourseSessionDetails(sessionId);

	    System.out.println("Total session details fetched = {}" + 
	            details == null ? 0 : details.size());

	    if (details != null) {
	        for (RDCourseSessionDetail d : details) {
	            log.debug("Detail → id={}, type={}, title={}",
	                    d.getSessionDetailId(), d.getType(), d.getTopic());
	        }
	    }

	    Map<String, List<RDCourseSessionDetail>> grouped = new HashMap<>();
	    for (RDCourseSessionDetail d : details) {
	        grouped.computeIfAbsent(d.getType(), k -> new ArrayList<>()).add(d);
	    }

	    // Summary — keys match JSP and canonical DB type values (no underscores)
	    Map<String, Integer> summary = new HashMap<>();
	    summary.put("video", grouped.getOrDefault("video", List.of()).size());
	    // Count both "pdf" and "notes" types under the Notes card
	    summary.put("pdf", grouped.getOrDefault("pdf", List.of()).size()
	                     + grouped.getOrDefault("notes", List.of()).size());
	    summary.put("quiz", grouped.getOrDefault("quiz", List.of()).size());
	    summary.put("flashcard", countFlashcardSetsForDetails(grouped.getOrDefault("flashcard", List.of())));
	    summary.put("matchinggame", grouped.getOrDefault("matchinggame", List.of()).size());
	    summary.put("matchpairs", grouped.getOrDefault("matchingpair", List.of()).size());
	    summary.put("memory-map", grouped.getOrDefault("memory-map", List.of()).size());
	    summary.put("assignment", grouped.getOrDefault("assignment", List.of()).size());
	    summary.put("exampaper", sizeByTypes(grouped, "exampaper", "exam_paper", "exam-paper", "exam paper"));
	    // labmanual: count from session details (canonical type = "labmanual")
	    summary.put("labmanual", grouped.getOrDefault("labmanual", List.of()).size());

	    System.out.println("SUMMARY COUNTS → {}" +  summary);

	    model.addAttribute("session", session);
	    model.addAttribute("enrollment", enrollment);
	    model.addAttribute("summary", summary);
	    // courseId for mobile back-button in session-dashboard.jsp
	    if (session != null && session.getCourse() != null) {
	        model.addAttribute("courseId", session.getCourse().getCourseId());
	    }

	    System.out.println("=== SESSION DASHBOARD END ===");

	    return new ModelAndView("session-dashboard");
	}

	@GetMapping("/session/{sessionId}/summary")
	@ResponseBody
	public Map<String, Integer> getSessionSummary(@PathVariable int sessionId) {

	    Map<String, Integer> summary = new HashMap<>();
	    summary.put("video", courseSessionDetailService.countByType(sessionId, "video"));
	    summary.put("quiz", courseSessionDetailService.countByType(sessionId, "quiz"));
	    // "pdf" + "notes" both show under the Notes card (CMS courses use "notes" type)
	    summary.put("pdf", courseSessionDetailService.countByType(sessionId, "pdf")
	                     + courseSessionDetailService.countByType(sessionId, "notes"));
	    summary.put("flashcard", countFlashcardSetsForSession(sessionId));
	    // keep legacy keys and add canonical keys to avoid breaking older pages
	    Integer matchingGame = courseSessionDetailService.countByType(sessionId, "matchinggame");
	    Integer matchPairs = courseSessionDetailService.countByType(sessionId, "matchingpair");
	    summary.put("matchingame", matchingGame);
	    summary.put("matchinggame", matchingGame);
	    summary.put("matchingpairs", matchPairs);
	    summary.put("matchpairs", matchPairs);
	    summary.put("memory-map", courseSessionDetailService.countByType(sessionId, "memory-map"));
	    summary.put("assignment", courseSessionDetailService.countByType(sessionId, "assignment"));
	    summary.put("exampaper", countByAnyType(sessionId, "exampaper", "exam_paper", "exam-paper", "exam paper"));
	    summary.put("labmanual", courseSessionDetailService.countByType(sessionId, "labmanual"));

	    return summary;
	}


	@PostMapping("/saveCourse")
	public String saveCourse(@ModelAttribute("courseForm") RDCourseForm courseForm, BindingResult result) {
	    
		if (result.hasErrors()) {
	        return "course-form";
	    }
	    // Fetch the existing category from the database using the provided category ID
	    RDCourseCategory courseCategory = courseCategoryService.getRDCourseCategoryById(courseForm.getCourseCategoryId());
	    if (courseCategory == null) {
	        // Handle the case where the category is not found (optional, but recommended)
	        result.rejectValue("courseCategoryId", "error.courseCategoryId", "Invalid course category.");
	        return "course-form";
	    }
	    // Check if courseForm has a course ID and fetch the corresponding course from the database
	    RDCourse theCourse = ( courseForm.getCourseId() > 0)
	                            ? service.getRDCourse(courseForm.getCourseId())
	                            : new RDCourse();
	    
	    theCourse.setCourseName(courseForm.getCourseName());
	    theCourse.setCourseCategory(courseCategory); // Properly set the fetched course category
	    // Handle image upload
	    MultipartFile imageFile = courseForm.getImageFile();
	    if (imageFile != null && !imageFile.isEmpty()) {
	        // Dynamically resolve the path to the webapps/resources/assets/images directory
	    	
	        String uploadDir = servletContext.getRealPath("/resources/assets/images/");
	        
	        File uploadDirFile = new File(uploadDir);
	        if (!uploadDirFile.exists()) {
	            uploadDirFile.mkdirs(); // Create the directory if it doesn't exist
	        }
	        String fileName = imageFile.getOriginalFilename();
	        try {
	            File destination = new File(uploadDir + fileName);
	            imageFile.transferTo(destination);

	            // Store relative path in the database
	            theCourse.setCourseImageUrl("assets/images/" + fileName);
	        } catch (IOException e) {
	            e.printStackTrace();
	            result.rejectValue("imageFile", "error.imageFile", "Failed to upload the image.");
	            return "course-form";
	        }
	    }
	    // Save the course
	    theCourse.setFeatured(true);
 	    service.saveRDCourse(theCourse);
	    return "redirect:/course/list";
	}

    @GetMapping("/updateForm")
    public String showFormForUpdate(@RequestParam("courseId") int theId,
        Model theModel) {
    	RDCourse course = service.getRDCourse(theId);
    	
    	 // Fetch all course categories to populate the dropdown
        List<RDCourseCategory> courseCategories = courseCategoryService.getRDCourseCategories();

    	RDCourseForm courseForm = course.toRDCourseForm(course);
        theModel.addAttribute("courseForm", courseForm);
        theModel.addAttribute("courseCategories", courseCategories);

        return "course-form";
    }

    @GetMapping("/delete")
    public String deleteCourse(@RequestParam("courseId") int theId, RedirectAttributes redirectAttributes) {
        try {
            service.deleteRDCourse(theId);
            redirectAttributes.addFlashAttribute("successMessage", "Course deleted successfully!");
        } catch (DataIntegrityViolationException e) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "Cannot delete this course because it is linked with other records (like enrollments or offerings).");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage",
                    "Something went wrong while deleting the course. Please try again.");
        }
        return "redirect:/course/list";
    }

    @GetMapping("/session/{sessionId}/videos")
    public ModelAndView sessionVideos(
            @PathVariable int sessionId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        RDCourseSession session = courseSessionservice.getCourseSession(sessionId);
        RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);

        List<RDCourseSessionDetail> videos =
                courseSessionDetailService.getBySessionAndType(sessionId, "video");

        model.addAttribute("session", session);
        model.addAttribute("enrollment", enrollment);
        model.addAttribute("videos", videos);

        return new ModelAndView("session-videos");
    }

    @GetMapping("/session/{sessionId}/pdfs")
    public ModelAndView sessionPdfs(
            @PathVariable int sessionId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        RDCourseSession session = courseSessionservice.getCourseSession(sessionId);
        RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);

        List<RDCourseSessionDetail> pdfs = new ArrayList<>(
                courseSessionDetailService.getBySessionAndType(sessionId, "pdf"));
        // Also include "notes" type (CMS-imported courses e.g. Course 162)
        pdfs.addAll(courseSessionDetailService.getBySessionAndType(sessionId, "notes"));

        // If any are JSON-backed (file path set), use list-picker (auto-skips to viewer if only 1)
        boolean hasJsonBacked = pdfs.stream()
                .anyMatch(d -> d.getFile() != null && !d.getFile().trim().isEmpty());
        if (hasJsonBacked) {
            return new ModelAndView("redirect:/student/content/list/"
                    + sessionId + "/notes?enrollmentId=" + enrollmentId);
        }

        model.addAttribute("session", session);
        model.addAttribute("enrollment", enrollment);
        model.addAttribute("pdfs", pdfs);

        return new ModelAndView("session-pdfs");
    }

    @GetMapping("/session/{sessionId}/quizzes")
    public ModelAndView sessionQuizzes(
            @PathVariable int sessionId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        RDCourseSession session =
                courseSessionservice.getCourseSession(sessionId);

        RDStudentEnrollment enrollment =
                enrollmentService.getRDStudentEnrollment(enrollmentId);

        // 1️⃣ Fetch quiz session details
        List<RDCourseSessionDetail> quizDetails =
                courseSessionDetailService.getBySessionAndType(sessionId, "quiz");

        // 2️⃣ Extract real RDQuiz objects
        List<RDQuiz> quizzes = quizDetails.stream()
                .map(RDCourseSessionDetail::getQuiz)
                .filter(Objects::nonNull)
                .toList();

        // If no DB-backed quizzes, check for JSON-backed (CMS courses like 162)
        if (quizzes.isEmpty()) {
            boolean hasJsonQuiz = quizDetails.stream()
                    .anyMatch(d -> d.getFile() != null && !d.getFile().trim().isEmpty());
            if (hasJsonQuiz) {
                return new ModelAndView("redirect:/student/content/list/"
                        + sessionId + "/quiz?enrollmentId=" + enrollmentId);
            }
        }

        model.addAttribute("session", session);
        model.addAttribute("enrollment", enrollment);
        model.addAttribute("quizzes", quizzes);

        // 🔑 MUST MATCH /views/quizzes/list.jsp
        return new ModelAndView("quizzes/list");
    }



    @GetMapping("/session/{sessionId}/flashcards")
    public ModelAndView sessionFlashcards(
            @PathVariable int sessionId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        RDCourseSession session = courseSessionservice.getCourseSession(sessionId);
        List<RDCourseSessionDetail> flashcards =
                courseSessionDetailService.getBySessionAndType(sessionId, "flashcard");

        if (flashcards != null && !flashcards.isEmpty()) {
            RDCourseSessionDetail first = flashcards.get(0);
            // JSON-backed (CMS courses) → use list-picker (auto-skips to viewer if only 1)
            if (first.getFile() != null && !first.getFile().trim().isEmpty()) {
                return new ModelAndView("redirect:/student/content/list/"
                        + sessionId + "/flashcard?enrollmentId=" + enrollmentId);
            }
            // DB-backed → use legacy flashcard viewer
            int detailId = first.getCourseSessionDetailId();
            Integer courseId = (session != null && session.getCourse() != null)
                    ? session.getCourse().getCourseId()
                    : null;
            StringBuilder redirectUrl = new StringBuilder("redirect:/flashcards/start/")
                    .append(detailId)
                    .append("?sessionId=").append(sessionId)
                    .append("&enrollmentId=").append(enrollmentId);
            if (courseId != null) {
                redirectUrl.append("&courseId=").append(courseId);
            }
            return new ModelAndView(redirectUrl.toString());
        }

        RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);
        model.addAttribute("session", session);
        model.addAttribute("enrollment", enrollment);
        model.addAttribute("flashcards", flashcards);
        if (session != null && session.getCourse() != null) {
            model.addAttribute("courseId", session.getCourse().getCourseId());
        }

        return new ModelAndView("session-flashcards");
    }

    @GetMapping("/session/{sessionId}/memory-maps")
    public ModelAndView sessionMemoryMaps(
            @PathVariable int sessionId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        RDCourseSession session = courseSessionservice.getCourseSession(sessionId);
        RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);

        List<RDCourseSessionDetail> memoryMaps =
                courseSessionDetailService.getBySessionAndType(sessionId, "memory-map");

        model.addAttribute("session", session);
        model.addAttribute("enrollment", enrollment);
        model.addAttribute("memoryMaps", memoryMaps);

        return new ModelAndView("session-memory-maps");
    }

    @GetMapping("/session/{sessionId}/assignments")
    public ModelAndView sessionAssignments(
            @PathVariable int sessionId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        RDCourseSession session = courseSessionservice.getCourseSession(sessionId);
        RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);

        List<RDCourseSessionDetail> assignments =
                courseSessionDetailService.getBySessionAndType(sessionId, "assignment");

        model.addAttribute("session", session);
        model.addAttribute("enrollment", enrollment);
        model.addAttribute("assignments", assignments);

        return new ModelAndView("session-assignments");
    }

    @GetMapping("/session/{sessionId}/exam-papers")
    public ModelAndView sessionExamPapers(
            @PathVariable int sessionId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        // Fetch session
        RDCourseSession session =
                courseSessionservice.getCourseSession(sessionId);

        // Fetch enrollment
        RDStudentEnrollment enrollment =
                enrollmentService.getRDStudentEnrollment(enrollmentId);

        List<RDCourseSessionDetail> examDetails =
                courseSessionDetailService.getExamDetailsWithPapers(sessionId);

        // Extract actual RDExamPaper objects
        List<RDExamPaper> examPapers = examDetails.stream()
                .map(RDCourseSessionDetail::getExamPaper)
                .filter(Objects::nonNull)
                .toList();

        model.addAttribute("session", session);
        model.addAttribute("enrollment", enrollment);
        model.addAttribute("examPapers", examPapers);

        return new ModelAndView("exam/list");
    }

    private int countFlashcardSetsForSession(int sessionId) {
        List<RDCourseSessionDetail> flashcardDetails =
                courseSessionDetailService.getBySessionAndType(sessionId, "flashcard");
        return countFlashcardSetsForDetails(flashcardDetails);
    }

    private int countByAnyType(int sessionId, String... types) {
        if (types == null || types.length == 0) {
            return 0;
        }

        int total = 0;
        Set<String> seen = new HashSet<>();
        for (String type : types) {
            if (type == null) {
                continue;
            }
            String normalized = type.trim().toLowerCase(Locale.ROOT);
            if (normalized.isEmpty() || !seen.add(normalized)) {
                continue;
            }
            Integer count = courseSessionDetailService.countByType(sessionId, normalized);
            total += count == null ? 0 : count;
        }
        return total;
    }

    private int sizeByTypes(Map<String, List<RDCourseSessionDetail>> grouped, String... types) {
        if (grouped == null || grouped.isEmpty() || types == null || types.length == 0) {
            return 0;
        }

        int total = 0;
        for (Map.Entry<String, List<RDCourseSessionDetail>> entry : grouped.entrySet()) {
            String key = entry.getKey();
            if (key == null) {
                continue;
            }
            for (String type : types) {
                if (type != null && key.equalsIgnoreCase(type)) {
                    total += entry.getValue() == null ? 0 : entry.getValue().size();
                    break;
                }
            }
        }
        return total;
    }

    private int countFlashcardSetsForDetails(List<RDCourseSessionDetail> flashcardDetails) {
        if (flashcardDetails == null || flashcardDetails.isEmpty()) {
            return 0;
        }

        int totalSets = 0;
        for (RDCourseSessionDetail detail : flashcardDetails) {
            if (detail == null) {
                continue;
            }

            // CMS/JSON-backed flashcard topics do not use rd_flashcard_sets rows.
            // Count each JSON-backed topic as one available flashcard set entry in UI.
            boolean jsonBacked = detail.getFile() != null && !detail.getFile().trim().isEmpty();

            List<RDFlashcardSetDTO> sets =
                    rdFlashCardSetService.getFlashCardSetsByCourseSessionDetail(detail.getCourseSessionDetailId());
            int setCount = (sets == null ? 0 : sets.size());

            if (setCount > 0) {
                totalSets += setCount;
            } else if (jsonBacked) {
                totalSets += 1;
            }
        }

        return totalSets;
    }

}
