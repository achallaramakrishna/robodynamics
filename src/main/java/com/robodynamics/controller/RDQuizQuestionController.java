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
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizQuestion.DifficultyLevel;
import com.robodynamics.model.RDQuizQuestionMap;
import com.robodynamics.model.RDSlide;
import com.robodynamics.model.RDUser;
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
       //     @RequestParam(value = "quizId", required = false) Integer quizId,
            RedirectAttributes redirectAttributes,
            HttpSession session) {

    	Integer quizId = 0;
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");

        // Step 1: Validate if the file is empty
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/quizquestions/listQuizQuestions";
        }

        try {
            // Step 2: Parse and process the JSON file
            ObjectMapper objectMapper = new ObjectMapper();
            RDQuizQuestionUploadDTO questionUploadDTO = objectMapper.readValue(file.getInputStream(), RDQuizQuestionUploadDTO.class);

            RDQuiz newQuiz = null; // Placeholder for a new quiz

            // Validate courseSessionId for questionBank
            if ("questionBank".equalsIgnoreCase(associationType) && courseSessionId == null) {
                redirectAttributes.addFlashAttribute("error", "Course session ID is required for Question Bank.");
                return "redirect:/quizquestions/listQuizQuestions";
            }

            // Loop through each question in the JSON
            for (RDQuizQuestionDTO questionDTO : questionUploadDTO.getQuestions()) {
                RDQuizQuestion question = new RDQuizQuestion();
                question.setQuestionText(questionDTO.getQuestionText());
                System.out.println(questionDTO.getQuestionText());
                question.setQuestionType(questionDTO.getQuestionType());
                System.out.println(questionDTO.getDifficultyLevel());
                question.setDifficultyLevel(DifficultyLevel.valueOf(questionDTO.getDifficultyLevel()));
                question.setCorrectAnswer(questionDTO.getCorrectAnswer());
                question.setMaxMarks(questionDTO.getMaxMarks());
                question.setAdditionalInfo(questionDTO.getAdditionalInfo());
                question.setPoints(questionDTO.getPoints());
                
                if(questionDTO.getExamType()!= null) {
                    question.setExamType(questionDTO.getExamType());
                }
                

                // Set tier level if provided
                String tierLevelString = questionDTO.getTierLevel();
                if (tierLevelString != null) {
                    question.setTierLevel(RDQuizQuestion.TierLevel.valueOf(tierLevelString.toUpperCase()));
                }

                if ("questionBank".equalsIgnoreCase(associationType)) {
                    // For Question Bank, store courseSessionId and save the question
                    RDCourseSession courseSession = courseSessionService.getCourseSession(courseSessionId);
                    question.setCourseSession(courseSession); // Assuming there's a courseSession relationship in the RDQuizQuestion entity
                    quizQuestionService.saveOrUpdate(question);
                    continue;
                }

                // Fetch course session detail for non-questionBank types
                RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
                question.setCourseSessionDetail(courseSessionDetail);

                if ("slide".equalsIgnoreCase(associationType)) {
                    // Associate with a slide if slide number is provided
                    if ( questionDTO.getSlideNumber() != 0) {
                        RDSlide slide = slideService.findByCourseSessionDetailIdAndSlideNumber(courseSessionDetailId, questionDTO.getSlideNumber());
                        if (slide != null) {
                            question.setSlide(slide);
                        } else {
                            throw new IllegalArgumentException("Slide not found for the provided slide number and course session detail ID.");
                        }
                    }
                    quizQuestionService.saveOrUpdate(question);
                } else if ("quiz".equalsIgnoreCase(associationType)) {
                	
                	 // Check if quizId is provided
                    if (quizId != null && quizId > 0) {
                        // Fetch the provided quiz
                    	newQuiz = quizService.findById(quizId);
                    } else if (quizId == null || quizId <= 0) {
                        // Automatically create a new quiz if not provided
                        newQuiz = new RDQuiz();
                        newQuiz.setShortDescription("This quiz was auto-created during question upload.");
                        newQuiz.setCourseSessionDetail(courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId));
                        newQuiz.setQuizName(newQuiz.getCourseSessionDetail().getTopic()); // You can customize the naming logic
                        newQuiz.setCategory(newQuiz.getCourseSessionDetail().getCourseSession().getCourse().getCourseCategory().getCourseCategoryName());
                        newQuiz.setGradeRange(RDQuiz.GradeRange.ALL_GRADES);
                        newQuiz.setCourseSession(newQuiz.getCourseSessionDetail().getCourseSession());
                        newQuiz.setCourse(newQuiz.getCourseSessionDetail().getCourseSession().getCourse());
                        newQuiz.setCreatedByUser(currentUser);
                        quizService.saveOrUpdate(newQuiz);
                        quizId = newQuiz.getQuizId();
                    }
                    // Associate with a quiz
                   // RDQuiz quiz = quizService.findById(quizId);
                    
                    quizQuestionService.saveOrUpdate(question);

                    // Map the question to the quiz
                    RDQuizQuestionMap quizQuestionMap = new RDQuizQuestionMap();
                    quizQuestionMap.setQuiz(newQuiz);
                    quizQuestionMap.setQuestion(question);
                    quizQuestionMapService.saveQuizQuestionMap(quizQuestionMap);

                    // Optionally update course session detail with quiz
                    courseSessionDetail.setQuiz(newQuiz);
                    courseSessionDetailService.saveRDCourseSessionDetail(courseSessionDetail);
                } else {
                    throw new IllegalArgumentException("Invalid association type or missing required data.");
                }

                // Save multiple-choice options if applicable
                if ("multiple_choice".equalsIgnoreCase(question.getQuestionType()) && questionDTO.getOptions() != null) {
                    for (RDQuizOptionDTO optionDTO : questionDTO.getOptions()) {
                        RDQuizOption option = new RDQuizOption();
                        option.setOptionText(optionDTO.getOptionText());
                        option.setCorrect(optionDTO.isCorrect());
                        option.setQuestion(question);  // Link the option to the question
                        quizOptionService.save(option);
                    }
                }
            }

            // Success feedback
            redirectAttributes.addFlashAttribute("success", "Questions uploaded successfully!");
            return "redirect:/quizquestions/listQuizQuestions";

        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
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
