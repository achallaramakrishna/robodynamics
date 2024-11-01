package com.robodynamics.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDQuizOptionService;
import com.robodynamics.service.RDQuizQuestionMapService;
import com.robodynamics.service.RDQuizQuestionService;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.service.RDSlideService;

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
    	
    	System.out.println("inside course sessions.. get method");
        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("courseSessions", courseSessions);
        return response;
    }

    @GetMapping("/getCourseSessionDetails")
    @ResponseBody
    public Map<String, Object> getCourseSessionDetails(@RequestParam("sessionId") int sessionId) {
        List<RDCourseSessionDetail> sessionDetails = courseSessionDetailService.findSessionDetailsBySessionId(sessionId);
        Map<String, Object> response = new HashMap<>();
        response.put("sessionDetails", sessionDetails);
        return response;
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
    public String uploadQuestions(@RequestParam("file") MultipartFile file,
                                  @RequestParam("courseSessionDetailId") int courseSessionDetailId,
                                  @RequestParam("associationType") String associationType,
                                  @RequestParam(value = "slideId", required = false) Integer slideId,
                                  @RequestParam(value = "quizId", required = false) Integer quizId,
                                  RedirectAttributes redirectAttributes) {
        // Step 1: Validate if the file is empty
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/quizquestions/listQuizQuestions";
        }

        try {
            // Step 2: Parse and process the JSON file
            ObjectMapper objectMapper = new ObjectMapper();
            RDQuizQuestionUploadDTO questionUploadDTO = objectMapper.readValue(file.getInputStream(), RDQuizQuestionUploadDTO.class);

            // Step 3: Loop through each question and save it
            for (RDQuizQuestionDTO questionDTO : questionUploadDTO.getQuestions()) {
                RDQuizQuestion question = new RDQuizQuestion();
                question.setQuestionText(questionDTO.getQuestionText());
                question.setQuestionType(questionDTO.getQuestionType());
                question.setDifficultyLevel(DifficultyLevel.valueOf(questionDTO.getDifficultyLevel()));
                question.setCorrectAnswer(questionDTO.getCorrectAnswer());
                question.setMaxMarks(questionDTO.getMaxMarks());
                question.setAdditionalInfo(questionDTO.getAdditionalInfo());
                question.setPoints(questionDTO.getPoints());
                question.setQuestionNumber(questionDTO.getQuestionNumber());

                // Set the course session detail (mandatory for all questions)
                RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
                question.setCourseSessionDetail(courseSessionDetail);

                // Step 4: Handle slide association using slide number from JSON (if present)
                if (questionDTO.getSlideNumber() != 0) {
                    // Find the slide based on slide number and course session detail ID
                    RDSlide slide = slideService.findByCourseSessionDetailIdAndSlideNumber(courseSessionDetailId, questionDTO.getSlideNumber());
                    if (slide != null) {
                        question.setSlide(slide);
                    } else {
                        throw new IllegalArgumentException("Slide not found for the provided slide number and course session detail ID.");
                    }
                }

                // Handle the association type (Slide or Quiz)
                if ("quiz".equalsIgnoreCase(associationType) && quizId != null && quizId > 0) {
                    RDQuiz quiz = quizService.findById(quizId);

                    // Save the question and let the DB assign the ID
                    quizQuestionService.saveOrUpdate(question);

                    // Map the question to the quiz
                    RDQuizQuestionMap quizQuestionMap = new RDQuizQuestionMap();
                    quizQuestionMap.setQuiz(quiz);
                    quizQuestionMap.setQuestion(question);
                    quizQuestionMapService.saveQuizQuestionMap(quizQuestionMap);

                    // Also update the session detail with the selected quiz ID
                    courseSessionDetail.setQuiz(quiz);
                    courseSessionDetailService.saveRDCourseSessionDetail(courseSessionDetail);
                } else if (!"quiz".equalsIgnoreCase(associationType)) {
                    // Save the question (for slide association scenario)
                    quizQuestionService.saveOrUpdate(question);
                } else {
                    throw new IllegalArgumentException("Invalid association type or missing IDs.");
                }

                // Save the associated options if it's a multiple-choice question
                if ("multiple_choice".equals(question.getQuestionType()) && questionDTO.getOptions() != null) {
                    for (RDQuizOptionDTO optionDTO : questionDTO.getOptions()) {
                        RDQuizOption option = new RDQuizOption();
                        option.setOptionText(optionDTO.getOptionText());
                        option.setCorrect(optionDTO.isCorrect());
                        option.setQuestion(question);  // Link the option to the question
                        System.out.println("option - " + option);
                        quizOptionService.save(option);
                    }
                }
            }

            // Step 5: Set a success message and redirect to the questions list
            redirectAttributes.addFlashAttribute("success", "Questions uploaded successfully!");
            return "redirect:/quizquestions/listQuizQuestions";

        } catch (Exception e) {
            // Handle any error during the processing
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
