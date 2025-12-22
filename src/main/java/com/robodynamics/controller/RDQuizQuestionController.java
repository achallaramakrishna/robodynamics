package com.robodynamics.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dto.RDQuizOptionDTO;
import com.robodynamics.dto.RDQuizQuestionDTO;
import com.robodynamics.dto.RDQuizQuestionUploadDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;
import com.robodynamics.model.RDQuizQuestionMap;
import com.robodynamics.model.RDSlide;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseCategoryService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDQuizOptionService;
import com.robodynamics.service.RDQuizQuestionMapService;
import com.robodynamics.service.RDQuizQuestionService;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.service.RDSlideService;
import com.robodynamics.wrapper.CourseSessionDetailJson;
import com.robodynamics.wrapper.CourseSessionJson;

@Controller
@RequestMapping("/quizquestions")
public class RDQuizQuestionController {

	@Autowired
    private RDQuizService quizService;
	
	@Autowired
	private RDCourseCategoryService courseCategoryService;
	
	@Autowired
	private RDCourseService courseService;
	
	@Autowired
	private RDCourseSessionService courseSessionService;
	
	@Autowired
	private RDSlideService slideService;
	
    @Autowired
    private RDQuizQuestionService quizQuestionService;
    
    @Autowired
    private RDQuizOptionService quizOptionService;
    
    @Autowired
    private RDQuizQuestionMapService quizQuestionMapService;
    
    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;
    
   
    @GetMapping("/getCoursesByCategory")
    @ResponseBody
    public Map<String, Object> getCoursesByCategory(@RequestParam("categoryId") int categoryId) {

        // Fetch courses by category
        List<RDCourse> courses = courseService.getCoursesByCategoryId(categoryId);

        // Convert to lightweight DTO to avoid Lazy issues
        List<Map<String, Object>> dto = courses.stream().map(c -> {
            Map<String, Object> map = new HashMap<>();
            map.put("courseId", c.getCourseId());
            map.put("courseName", c.getCourseName());
            return map;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("courses", dto);

        return response;
    }

    
    @GetMapping("/getCourseSessions")
    @ResponseBody
    public Map<String, Object> getCourseSessions(@RequestParam("courseId") int courseId) {
        List<RDCourseSession> sessions = courseSessionService.getCourseSessionsByCourseId(courseId);

        List<CourseSessionJson> dto = sessions.stream().map(s -> {
            CourseSessionJson d = new CourseSessionJson();
            d.setSessionId(s.getCourseSessionId());
            d.setSessionTitle(s.getSessionTitle());
      //      d.setVersion(s.getVersion() != null ? s.getVersion() : 1);
            d.setGrade(s.getGrade());
            d.setSessionType(s.getSessionType() != null ? s.getSessionType() : null);
            d.setSessionDescription(s.getSessionDescription());
            if (s.getParentSession() != null) {
                d.setParentSessionId(s.getParentSession().getCourseSessionId());
            }
            if (s.getTierLevel() != null) {
                d.setTierLevel(s.getTierLevel().name());
            }
       //     d.setTierOrder(s.getTierOrder() != null ? s.getTierOrder() : 0);
            return d;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("courseSessions", dto);
        return response;
    }

    @GetMapping("/getCourseSessionDetails")
    @ResponseBody
    public Map<String, Object> getCourseSessionDetails(@RequestParam("sessionId") int sessionId) {
        List<RDCourseSessionDetail> details = courseSessionDetailService.findSessionDetailsBySessionId(sessionId);

        List<CourseSessionDetailJson> dtoList = details.stream().map(d -> {
            CourseSessionDetailJson dto = new CourseSessionDetailJson();
            dto.setSessionId(d.getCourseSession().getCourseSessionId());
            dto.setSessionDetailId(d.getCourseSessionDetailId());
            dto.setTopic(d.getTopic());
        //    dto.setVersion(d.getVersion() != null ? d.getVersion() : 1);
            dto.setType(d.getType());
            dto.setFile(d.getFile());
            if (d.getTierLevel() != null) {
                dto.setTierLevel(d.getTierLevel().name());
            }
       //     dto.setTierOrder(d.getTierOrder() != null ? d.getTierOrder() : 0);
            return dto;
        }).collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("sessionDetails", dtoList);
        return response;
    }

    @GetMapping("/manageMedia")   // GET /robodynamics/quizquestions/manageMedia
    public String manageMedia(Model model) {
        // TODO: replace with real service call
        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses != null ? courses : java.util.Collections.emptyList());

        model.addAttribute("mediaList", java.util.Collections.emptyList());
        return "quizquestions/quizMediaManager"; // resolves to /WEB-INF/views/quizMediaManager.jsp
    } 
    
    @GetMapping("/listQuizQuestions")
    public String listQuizQuestions(@RequestParam(value = "page", defaultValue = "0") int page,
                                    @RequestParam(value = "size", defaultValue = "10") int size,
                                    Model model) {
        List<RDQuizQuestion> questions = quizQuestionService.findPaginated(page, size);
        long totalQuestions = quizQuestionService.countQuestions();
        int totalPages = (int) Math.ceil((double) totalQuestions / size);

        // ⬇️ Course Categories
        List<RDCourseCategory> categories = courseCategoryService.getRDCourseCategories();
        model.addAttribute("categories", categories);
        
        model.addAttribute("questions", questions);
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", totalPages);
        model.addAttribute("size", size);

    	List<RDCourse> courses = courseService.getRDCourses();
    	model.addAttribute("courses",courses);
    	
    	List<RDQuiz> quizzes = quizService.findAll();
    	model.addAttribute("quizzes",quizzes);

        return "quizquestions/uploadQuestionsWithSelections";  // Make sure your JSP name is correct
    }
    
    // Method to display the list of quiz questions
    @GetMapping("/list")
    public String listQuizQuestions(Model model) {
        // Fetch all quiz questions from the service
	        List<RDQuizQuestion> questions = quizQuestionService.findAll();
        
        // Add the list of questions to the model
        model.addAttribute("questions", questions);
        
        // Specify the JSP file to render the questions list
        return "quizquestions/quizQuestionsDashboard";
    }

    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("quizQuestion", new RDQuizQuestion());
        return "quizquestions/add";
    }

    @PostMapping("/save")
    public String saveQuizQuestion(@ModelAttribute("quizQuestion") RDQuizQuestion quizQuestion) {
        quizQuestionService.saveOrUpdate(quizQuestion);
        return "redirect:/quizquestions";
    }

    @GetMapping("/edit/{questionId}")
    public String showEditForm(@PathVariable int questionId, Model model) {
        RDQuizQuestion quizQuestion = quizQuestionService.findById(questionId);
        model.addAttribute("quizQuestion", quizQuestion);
        return "quizquestions/edit";
    }

    @PostMapping("/update")
    public String updateQuizQuestion(@ModelAttribute("quizQuestion") RDQuizQuestion quizQuestion) {
        quizQuestionService.saveOrUpdate(quizQuestion);
        return "redirect:/quizquestions";
    }

    @GetMapping("/delete/{questionId}")
    public String deleteQuizQuestion(@PathVariable int questionId) {
        RDQuizQuestion quizQuestion = quizQuestionService.findById(questionId);
        quizQuestionService.delete(quizQuestion);
        return "redirect:/quizquestions";
    }
    
    @PostMapping("/uploadJson")
    public String uploadQuestions(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "courseSessionId", required = false) Integer courseSessionId,
            @RequestParam(value = "courseSessionDetailId", required = false) Integer courseSessionDetailId,
            @RequestParam("associationType") String associationType,
            @RequestParam(value = "slideId", required = false) Integer slideId,
            RedirectAttributes redirectAttributes,
            HttpSession session) {

        Integer quizId = 0;
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");

        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/quizquestions/listQuizQuestions";
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            RDQuizQuestionUploadDTO questionUploadDTO =
                    objectMapper.readValue(file.getInputStream(), RDQuizQuestionUploadDTO.class);

            RDQuiz newQuiz = null;

            if ("questionBank".equalsIgnoreCase(associationType) && courseSessionId == null) {
                redirectAttributes.addFlashAttribute("error",
                        "Course session ID is required for Question Bank.");
                return "redirect:/quizquestions/listQuizQuestions";
            }

            for (RDQuizQuestionDTO questionDTO : questionUploadDTO.getQuestions()) {

                RDQuizQuestion question = new RDQuizQuestion();

                // ---------------- CORE FIELDS ----------------
                question.setQuestionText(questionDTO.getQuestionText());
                question.setQuestionType(
                        questionDTO.getQuestionType() != null ? questionDTO.getQuestionType() : "multiple_choice"
                );

                // Difficulty → backward safe
                try {
                    if (questionDTO.getDifficultyLevel() != null)
                        question.setDifficultyLevel(
                                DifficultyLevel.valueOf(questionDTO.getDifficultyLevel())
                        );
                    else
                        question.setDifficultyLevel(DifficultyLevel.Easy);
                } catch (Exception ex) {
                    question.setDifficultyLevel(DifficultyLevel.Easy);
                }

                // Answer
                question.setCorrectAnswer(questionDTO.getCorrectAnswer());

                // max marks safe default
                question.setMaxMarks(
                        questionDTO.getMaxMarks() != null ? questionDTO.getMaxMarks() : 1
                );

                // Additional info
                question.setAdditionalInfo(questionDTO.getAdditionalInfo());

                // Points safe
                question.setPoints(
                        questionDTO.getPoints() != 0 ? questionDTO.getPoints() : 1
                );

                // Exam Type
                if (questionDTO.getExamType() != null)
                    question.setExamType(questionDTO.getExamType());

                // Tier level (optional)
                if (questionDTO.getTierLevel() != null) {
                    try {
                        question.setTierLevel(
                                RDQuizQuestion.TierLevel.valueOf(
                                        questionDTO.getTierLevel().toUpperCase()
                                )
                        );
                    } catch (Exception ignored) {
                    }
                }

                // Tier order
                question.setTierOrder(questionDTO.getTierOrder());

                // ---------------- QUESTION BANK MODE ----------------
                if ("questionBank".equalsIgnoreCase(associationType)) {

                    RDCourseSession courseSession = courseSessionService.getCourseSession(courseSessionId);
                    question.setCourseSession(courseSession);

                    quizQuestionService.saveOrUpdate(question);

                    // Save options
                    if ("multiple_choice".equalsIgnoreCase(question.getQuestionType())
                            && questionDTO.getOptions() != null) {

                        for (RDQuizOptionDTO optionDTO : questionDTO.getOptions()) {
                            RDQuizOption option = new RDQuizOption();
                            option.setOptionText(optionDTO.getOptionText());
                            option.setCorrect(optionDTO.isCorrect());
                            option.setQuestion(question);
                            quizOptionService.save(option);
                        }
                    }

                    continue;
                }

                // ---------------- NON BANK → NEED SESSION DETAIL ----------------
                RDCourseSessionDetail courseSessionDetail =
                        courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
                question.setCourseSessionDetail(courseSessionDetail);

                // ---------------- SLIDE MAPPING ----------------
                if ("slide".equalsIgnoreCase(associationType)) {

                    if (questionDTO.getSlideNumber() != 0) {
                        RDSlide slide =
                                slideService.findByCourseSessionDetailIdAndSlideNumber(
                                        courseSessionDetailId,
                                        questionDTO.getSlideNumber()
                                );
                        if (slide != null)
                            question.setSlide(slide);
                        else
                            throw new IllegalArgumentException("Slide not found for given number");
                    }

                    quizQuestionService.saveOrUpdate(question);
                }

                // ---------------- QUIZ MAPPING ----------------
                else if ("quiz".equalsIgnoreCase(associationType)) {

                    if (quizId != null && quizId > 0) {
                        newQuiz = quizService.findById(quizId);
                    } else {
                        newQuiz = new RDQuiz();
                        newQuiz.setShortDescription("Auto-created quiz");
                        newQuiz.setCourseSessionDetail(courseSessionDetail);
                        newQuiz.setQuizName(courseSessionDetail.getTopic());
                        newQuiz.setCategory(
                                courseSessionDetail.getCourseSession()
                                        .getCourse()
                                        .getCourseCategory()
                                        .getCourseCategoryName()
                        );
                        newQuiz.setGradeRange(RDQuiz.GradeRange.ALL_GRADES);
                        newQuiz.setCourseSession(courseSessionDetail.getCourseSession());
                        newQuiz.setCourse(courseSessionDetail.getCourseSession().getCourse());
                        newQuiz.setCreatedByUser(currentUser);

                        quizService.saveOrUpdate(newQuiz);
                        quizId = newQuiz.getQuizId();
                    }

                    quizQuestionService.saveOrUpdate(question);

                    RDQuizQuestionMap map = new RDQuizQuestionMap();
                    map.setQuiz(newQuiz);
                    map.setQuestion(question);
                    quizQuestionMapService.saveQuizQuestionMap(map);

                    courseSessionDetail.setQuiz(newQuiz);
                    courseSessionDetailService.saveRDCourseSessionDetail(courseSessionDetail);
                }

                else {
                    throw new IllegalArgumentException("Invalid associationType");
                }

                // ---------------- OPTIONS ----------------
                if ("multiple_choice".equalsIgnoreCase(question.getQuestionType())
                        && questionDTO.getOptions() != null) {

                    for (RDQuizOptionDTO optionDTO : questionDTO.getOptions()) {
                        RDQuizOption option = new RDQuizOption();
                        option.setOptionText(optionDTO.getOptionText());
                        option.setCorrect(optionDTO.isCorrect());
                        option.setQuestion(question);
                        quizOptionService.save(option);
                    }
                }
            }

            redirectAttributes.addFlashAttribute("success", "Questions uploaded successfully!");
            return "redirect:/quizquestions/listQuizQuestions";

        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error",
                    "Error processing JSON file: " + e.getMessage());
            return "redirect:/quizquestions/listQuizQuestions";
        }
    }


         



    @PostMapping("/mapQuestions")
    public String mapQuestionsToQuiz(@RequestParam Integer quizId, @RequestParam List<Integer> questionIds) {
        RDQuiz quiz = quizService.findById(quizId);
    	for (Integer questionId : questionIds) {
    		RDQuizQuestion question = quizQuestionService.findById(questionId);
            RDQuizQuestionMap map = new RDQuizQuestionMap();
            map.setQuiz(quiz);
            map.setQuestion(question);
            quizQuestionMapService.saveQuizQuestionMap(map);
        }
        return "redirect:/quizzes/dashboard";
    }
}
