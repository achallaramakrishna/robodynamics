package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDMatchQuestion;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDMatchPair;
import com.robodynamics.service.RDMatchQuestionService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDMatchPairService;

/**
 * -------------------------------------------------
 * STUDENT MATCHING PAIR CONTROLLER
 * -------------------------------------------------
 * Handles:
 * 1. Showing matching pair activity for a session detail
 * 2. Playing the matching pair activity
 *
 * Mirrors:
 * - RDStudentMatchingGameController
 * - Student quiz / dashboard navigation flow
 */
@Controller
@RequestMapping("/student/matching-pair")
public class RDStudentMatchingPairController {
	
	@Autowired
	private RDCourseSessionService courseSessionservice;

    @Autowired
    private RDMatchQuestionService matchQuestionService;

    @Autowired
    private RDMatchPairService matchPairService;


@GetMapping("/list")
public String showMatchingPairList(
        @RequestParam("sessionId") int sessionId,
        @RequestParam("enrollmentId") int enrollmentId,
        Model model) {
	
	
	RDCourseSession session = courseSessionservice.getCourseSession(sessionId);
	
	System.out.println("Session id - " + sessionId);
	
    // Fetch ALL matching-pair questions under this session
    List<RDMatchQuestion> questions =
            matchQuestionService.findBySessionId(sessionId);
    System.out.println("Questions count - " + questions.size());
    
    model.addAttribute("session", session);

    model.addAttribute("questions", questions);
    model.addAttribute("sessionId", sessionId);
    model.addAttribute("enrollmentId", enrollmentId);

    return "matchpairs/matching_pair_list";
}


    /* -------------------------------------------------
     * PLAY MATCHING PAIR ACTIVITY
     * -------------------------------------------------
     * URL:
     * /student/matching-pair/play
     *   ?questionId=8
     *   &enrollmentId=45
     */
    @GetMapping("/play")
    public String playMatchingPair(
            @RequestParam("questionId") int questionId,
            @RequestParam("enrollmentId") int enrollmentId,
            Model model) {

        RDMatchQuestion question =
                matchQuestionService.getMatchQuestion(questionId);

        if (question == null) {
            model.addAttribute("error",
                    "Matching pair activity not found.");
            return "matching-pair/matching_pair_play";
        }

        // Fetch all pairs for this question
        List<RDMatchPair> pairs =
                matchPairService
                    .getPairsByQuestionId(questionId);

        // Resolve courseId for image path usage
        int courseId =
                question.getCourseSessionDetail()
                        .getCourseSession()
                        .getCourse()
                        .getCourseId();

        // Send data to JSP
        model.addAttribute("question", question);
        model.addAttribute("pairs", pairs);
        model.addAttribute("courseId", courseId);
        model.addAttribute("enrollmentId", enrollmentId);

        return "matchpairs/matching_pair_play";
    }

}
