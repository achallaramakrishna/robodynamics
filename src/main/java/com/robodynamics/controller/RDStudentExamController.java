package com.robodynamics.controller;

import com.robodynamics.dto.ExamResultView;
import com.robodynamics.model.*;
import com.robodynamics.model.RDExamSubmission.SubmissionStatus;
import com.robodynamics.service.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.nio.file.*;
import java.util.*;

@Controller
@RequestMapping("/student/exam")
public class RDStudentExamController {

    @Autowired
    private RDExamPaperService examPaperService;

    @Autowired
    private RDExamSubmissionService submissionService;
    
    @Autowired
    private RDExamEvaluationService examEvaluationService;
    
    @Autowired
    private RDExamResultService examResultService;


    

    /* =====================================================
       1️⃣ LIST EXAM PAPERS FOR A SESSION
       ===================================================== */
    @GetMapping("/session/{sessionId}")
    public String listExamPapers(
            @PathVariable Integer sessionId,
            @RequestParam Integer enrollmentId,
            HttpSession session,
            HttpServletRequest request,
            Model model
    ) {
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            session.setAttribute("redirectUrl", request.getRequestURI());
            return "redirect:/login";
        }

        model.addAttribute("examPapers",
                examPaperService.getExamPapersBySession(sessionId));

        model.addAttribute("submissionMap",
                submissionService.getStudentSubmissionsForSession(
                        rdUser.getUserID(), sessionId));

        model.addAttribute("enrollmentId", enrollmentId);
        return "exam/examPapers";
    }

    /* =====================================================
       2️⃣ SHOW UPLOAD PAGE
       ===================================================== */
    @GetMapping("/{examPaperId}/upload")
    public String showUploadPage(
            @PathVariable Integer examPaperId,
            HttpServletRequest request,
            HttpSession session,
            Model model
    ) {
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            session.setAttribute("redirectUrl", request.getRequestURI());
            return "redirect:/login";
        }

        RDExamSubmission submission =
                submissionService.getLatestSubmission(
                        examPaperId, rdUser.getUserID());

        if (submission != null &&
            submission.getStatus() != RDExamSubmission.SubmissionStatus.DRAFT) {
            return "redirect:/student/exam/submission/"
                    + submission.getSubmissionId();
        }

        model.addAttribute("examPaperId", examPaperId);
        return "exam/uploadAnswers";
    }

    /* =====================================================
       3️⃣ HANDLE ANSWER UPLOAD (FIXED)
       ===================================================== */
    @PostMapping("/{examPaperId}/upload")
    public String handleUpload(
            @PathVariable Integer examPaperId,
            @RequestParam("files") MultipartFile[] files,
            HttpServletRequest request,
            HttpSession session,
            Model model
    ) {
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            session.setAttribute("redirectUrl", request.getRequestURI());
            return "redirect:/login";
        }

        if (files == null || files.length == 0) {
            model.addAttribute("error", "Please upload at least one file.");
            model.addAttribute("examPaperId", examPaperId);
            return "exam/uploadAnswers";
        }

        try {
            RDExamSubmission submission =
                    submissionService.createDraftSubmission(
                            examPaperId,
                            rdUser.getUserID(),
                            files
                    );
            
            submissionService.markEvaluating(submission.getSubmissionId());

            
            // 🔥 Trigger AI evaluation (ASYNC recommended)
            examEvaluationService.evaluateSubmission(submission.getSubmissionId());


            return "redirect:/student/exam/submission/"
                    + submission.getSubmissionId();

        } catch (Exception e) {
            e.printStackTrace();
            model.addAttribute("error", "Upload failed: " + e.getMessage());
            return "exam/uploadAnswers";
        }
    }

    /* =====================================================
       4️⃣ VIEW SUBMISSION
       ===================================================== */
    @GetMapping("/submission/{submissionId}")
    public String viewSubmission(@PathVariable Integer submissionId,
                                 HttpSession session,
                                 Model model) {

        RDExamSubmission submission =
                submissionService.getByIdWithFiles(submissionId);

        List<String> fileNames = submission.getFilePaths()
                .stream()
                .map(p -> p.replace("\\", "/"))
                .map(p -> p.substring(p.lastIndexOf('/') + 1))
                .toList();

        model.addAttribute("fileNames", fileNames);
        model.addAttribute("submission", submission);
        return "exam/viewSubmission";
    }
    
 
    
    @GetMapping("/student/exam/submission/{submissionId}/result")
    public String viewResult(@PathVariable Integer submissionId,
                             HttpSession session,
                             Model model) {

    	RDExamSubmission submission =
    	        submissionService.getSubmissionById(submissionId);

    	    if (submission.getStatus() != SubmissionStatus.AI_EVALUATED) {
    	        return "exam/resultPending";
    	    }

    	    ExamResultView result =
    	        examResultService.getResultForSubmission(submissionId);

    	    model.addAttribute("result", result);
    	    return "exam/examResult";
    }

}
