package com.robodynamics.controller;

import com.robodynamics.dto.ExamResultView;
import com.robodynamics.model.*;
import com.robodynamics.model.RDExamSubmission.SubmissionStatus;
import com.robodynamics.service.*;
import com.robodynamics.service.impl.RDExamEvaluationAsyncRunner;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Controller
@RequestMapping("/student/exam")
public class RDStudentExamController {

    @Autowired
    private RDExamPaperService examPaperService;

    @Autowired
    private RDExamSubmissionService submissionService;

    @Autowired
    private RDExamEvaluationAsyncRunner asyncRunner;

    @Autowired
    private RDExamResultService examResultService;

    /* =====================================================
       1️⃣ LIST EXAM PAPERS
       ===================================================== */
    @GetMapping("/session/{sessionId}")
    public String listExamPapers(@PathVariable Integer sessionId,
                                 @RequestParam Integer enrollmentId,
                                 HttpSession session,
                                 HttpServletRequest request,
                                 Model model) {

        // System.out.println("➡️ ENTER listExamPapers()");
        // System.out.println("   sessionId=" + sessionId + ", enrollmentId=" + enrollmentId);

        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            // System.out.println("❌ rdUser NULL → redirect login");
            session.setAttribute("redirectUrl", request.getRequestURI().substring(request.getContextPath().length()));
            return "redirect:/login";
        }

        // System.out.println("✅ studentId=" + rdUser.getUserID());

        List<RDExamPaper> papers =
                examPaperService.getExamPapersBySession(sessionId);

        Map<Integer, RDExamSubmission> submissionMap =
                submissionService.getStudentSubmissionsForSession(
                        rdUser.getUserID(), sessionId);

        /* ===================== 🔍 LOGGING ===================== */
        // System.out.println("========== EXAM PAPER LIST DEBUG ==========");
        // System.out.println("Student ID : " + rdUser.getUserID());
        // System.out.println("Session ID : " + sessionId);
        // System.out.println("Exam Papers Count : " + papers.size());
        // System.out.println("Submissions Found : " + submissionMap.size());

        for (RDExamPaper p : papers) {
            RDExamSubmission sub = submissionMap.get(p.getExamPaperId());

            if (sub == null) {
                 System.out.println(                    "Paper ID " + p.getExamPaperId()
                    + " → NO SUBMISSION → Upload allowed"
                );
            } else {
                 System.out.println(
                    "Paper ID " + p.getExamPaperId()
                    + " → Submission ID " + sub.getSubmissionId()
                    + " → Status = " + sub.getStatus()
                );
            }
        }
        // System.out.println("==========================================");
        /* ====================================================== */

        model.addAttribute("examPapers", papers);
        model.addAttribute("submissionMap", submissionMap);
        model.addAttribute("enrollmentId", enrollmentId);

        // System.out.println("⬅️ EXIT listExamPapers()");
        return "exam/examPapers";
    }

    /* =====================================================
       2️⃣ SHOW UPLOAD PAGE
       ===================================================== */
    @GetMapping("/{examPaperId}/upload")
    public String showUploadPage(@PathVariable Integer examPaperId,
                                 HttpSession session,
                                 HttpServletRequest request,
                                 Model model) {

        // System.out.println("➡️ ENTER showUploadPage(), examPaperId=" + examPaperId);

        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            // System.out.println("❌ rdUser NULL → redirect login");
            return "redirect:/login";
        }

        // System.out.println("✅ studentId=" + rdUser.getUserID());

        RDExamSubmission latest =
                submissionService.getLatestSubmission(
                        examPaperId, rdUser.getUserID());

        if (latest == null) {
            // System.out.println("📌 No latest submission → show upload page");
            model.addAttribute("examPaperId", examPaperId);
            // System.out.println("⬅️ EXIT showUploadPage()");
            return "exam/uploadAnswers";
        }

        // System.out.println("📌 Latest submission found: id=" + latest.getSubmissionId() + ", status=" + latest.getStatus());

        // 🚫 BLOCK upload if submission already moved forward
        if (latest.getStatus() != SubmissionStatus.DRAFT) {
            // System.out.println("🚫 Upload page blocked → redirect to submission view");
            // System.out.println("⬅️ EXIT showUploadPage()");
        	
      //  	String scheme = request.getScheme();
      //  	String server = request.getServerName();
      //  	System.out.println("Scheme - " + scheme);
      //  	System.out.println("Server - " + server);

      //  	return "redirect:" + scheme + "://" + server 
      //  	       + "/student/exam/submission/" 
      //  	       + latest.getSubmissionId();

           	String host = request.getServerName();

        	if (host.contains("localhost") || host.contains("127.0.0.1")) {
        	    return "redirect:/student/exam/submission/" + latest.getSubmissionId();
        	}

        	return "redirect:https://robodynamics.in/student/exam/submission/" + latest.getSubmissionId();
        	// return "redirect:submission/" + latest.getSubmissionId();
        }

        model.addAttribute("examPaperId", examPaperId);
        // System.out.println("✅ Status=DRAFT → upload allowed");
        // System.out.println("⬅️ EXIT showUploadPage()");
        return "exam/uploadAnswers";
    }

    /* =====================================================
       3️⃣ HANDLE UPLOAD (STATE-SAFE + ASYNC SAFE)
       ===================================================== */
    @PostMapping("/{examPaperId}/upload")
    public String handleUpload(@PathVariable Integer examPaperId,
                               @RequestParam("files") MultipartFile[] files,
                               HttpSession session,
                               HttpServletRequest request,
                               Model model) {

        // System.out.println("➡️ ENTER handleUpload(), examPaperId=" + examPaperId);

    	
        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            // System.out.println("❌ rdUser NULL → redirect login");
            return "redirect:/login";
        }

        // System.out.println("👤 studentId=" + rdUser.getUserID());
        // System.out.println("📁 Files received=" + (files == null ? 0 : files.length));

        
        // ✅ Controller-level state gate (prevents re-upload during EVALUATING/AI_EVALUATED)
        RDExamSubmission existing =
                submissionService.getLatestSubmission(examPaperId, rdUser.getUserID());

        System.out.println("========== UPLOAD START ==========");
        System.out.println("StudentId = " + rdUser.getUserID());
        System.out.println("PaperId   = " + examPaperId);
        if(existing!=null)
        		System.out.println("Created SubmissionId = " + existing.getSubmissionId());
        System.out.println("==================================");

        if (existing != null && existing.getStatus() != SubmissionStatus.DRAFT) {
            // System.out.println("🚫 Upload blocked at controller");
            // System.out.println("   existingSubmissionId=" + existing.getSubmissionId());
            // System.out.println("   existingStatus=" + existing.getStatus());
            // System.out.println("⬅️ EXIT handleUpload()");
        	
        //	String scheme = request.getScheme();
        //	String server = request.getServerName();
        //	System.out.println("Scheme - " + scheme);
        //	System.out.println("Server - " + server);

        //	return "redirect:" + scheme + "://" + server 
        //	       + "/student/exam/submission/" 
        //	       + existing.getSubmissionId();

        	String host = request.getServerName();

        	
        	RDExamSubmission latest =
        		    submissionService.findLatestByStudentAndPaper(rdUser.getUserID(), examPaperId);

        		System.out.println("Redirecting to latest submissionId = " +
        		        latest.getSubmissionId());
        		
        	if (host.contains("localhost") || host.contains("127.0.0.1")) {
        	    return "redirect:/student/exam/submission/" + existing.getSubmissionId();
        	}

        	return "redirect:https://robodynamics.in/student/exam/submission/" + existing.getSubmissionId();

        	

        	// return "forward:/student/exam/submission/" + existing.getSubmissionId();
        }

        if (files == null || files.length == 0) {
            // System.out.println("❌ No files uploaded");
            model.addAttribute("error", "Please upload at least one file.");
            model.addAttribute("examPaperId", examPaperId);
            // System.out.println("⬅️ EXIT handleUpload()");
            return "exam/uploadAnswers";
        }

        try {
            // System.out.println("📝 Creating / updating DRAFT submission");
            RDExamSubmission submission =
                    submissionService.createDraftSubmission(
                            examPaperId,
                            rdUser.getUserID(),
                            files
                    );

            // System.out.println("✅ createDraftSubmission returned: id=" + submission.getSubmissionId() +   ", status=" + submission.getStatus());

            // ✅ If service returns a non-DRAFT/SUBMITTED state (e.g., blocked),
            // redirect to view page (extra safety).
            if (submission.getStatus() != SubmissionStatus.SUBMITTED &&
                submission.getStatus() != SubmissionStatus.DRAFT) {

                // System.out.println("🚫 Service returned non-uploadable state → redirecting");
                // System.out.println("⬅️ EXIT handleUpload()");
            	
        //    	String scheme = request.getScheme();
        //    	String server = request.getServerName();
            	
        //    	System.out.println("Scheme - " + scheme);
        //    	System.out.println("Server - " + server);

        //    	return "redirect:" + scheme + "://" + server 
        //    	       + "/student/exam/submission/" 
        //    	       + existing.getSubmissionId();

            	
               	String host = request.getServerName();

            	if (host.contains("localhost") || host.contains("127.0.0.1")) {
            	    return "redirect:/student/exam/submission/" + existing.getSubmissionId();
            	}

            	return "redirect:https://robodynamics.in/student/exam/submission/" + existing.getSubmissionId();
            	
            //	return "forward:/student/exam/submission/" + existing.getSubmissionId();
            }

            // System.out.println("🔁 Attempting SUBMITTED → EVALUATING");
            boolean started =
                    submissionService.markEvaluatingIfAllowed(
                            submission.getSubmissionId()
                    );

            // System.out.println("🔁 markEvaluatingIfAllowed() result=" + started);

            if (started) {
                // System.out.println("🚀 Triggering ASYNC evaluation");
                asyncRunner.runEvaluation(submission.getSubmissionId());
            } else {
                // System.out.println("⚠️ Evaluation already started / blocked");
            }

            submission =
                    submissionService.getByIdWithFiles(
                            submission.getSubmissionId()
                    );

            // System.out.println("📦 Reloaded submission");
            // System.out.println("   status=" + submission.getStatus());
            // System.out.println("   files=" + (submission.getFilePaths() == null ? 0 : submission.getFilePaths().size()));

            model.addAttribute("submission", submission);
            model.addAttribute("fileNames", submission.getFilePaths());

            // System.out.println("⬅️ EXIT handleUpload()");
            return "exam/viewSubmission";

        } catch (Exception e) {
            // System.out.println("🔥 ERROR in handleUpload(): " + e.getMessage());
            e.printStackTrace();
            model.addAttribute("error", "Upload failed: " + e.getMessage());
            model.addAttribute("examPaperId", examPaperId);
            // System.out.println("⬅️ EXIT handleUpload()");
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

        // System.out.println("➡️ ENTER viewSubmission(), submissionId=" + submissionId);

        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            // System.out.println("❌ rdUser NULL → redirect login");
            return "redirect:/login";
        }

        RDExamSubmission submission =
                submissionService.getByIdWithFiles(submissionId);

        if (submission == null) {
            // System.out.println("❌ Submission not found: " + submissionId);
            model.addAttribute("error", "Submission not found.");
            // System.out.println("⬅️ EXIT viewSubmission()");
            return "exam/resultPending"; // or a dedicated error page
        }

        // System.out.println("✅ Loaded submission");
        // System.out.println("   status=" + submission.getStatus());
        // System.out.println("   files=" + (submission.getFilePaths() == null ? 0 : submission.getFilePaths().size()));

        model.addAttribute("submission", submission);
        model.addAttribute("fileNames", submission.getFilePaths());

        // System.out.println("⬅️ EXIT viewSubmission()");
        return "exam/viewSubmission";
    }

    /* =====================================================
       5️⃣ VIEW RESULT
       ===================================================== */
    @GetMapping("/submission/{submissionId}/result")
    public String viewResult(@PathVariable Integer submissionId,
                             HttpSession session,
                             Model model) {

        // System.out.println("➡️ ENTER viewResult(), submissionId=" + submissionId);

        RDUser rdUser = (RDUser) session.getAttribute("rdUser");
        if (rdUser == null) {
            // System.out.println("❌ rdUser NULL → redirect login");
            return "redirect:/login";
        }

        RDExamSubmission submission =
                submissionService.getSubmissionById(submissionId);

        if (submission == null) {
            // System.out.println("❌ Submission not found: " + submissionId);
            model.addAttribute("error", "Submission not found.");
            // System.out.println("⬅️ EXIT viewResult()");
            return "exam/resultPending"; // or a dedicated error page
        }

        // System.out.println("📊 Submission status=" + submission.getStatus());

        if (submission.getStatus() != SubmissionStatus.AI_EVALUATED
                && submission.getStatus() != SubmissionStatus.REVIEW_REQUIRED
                && submission.getStatus() != SubmissionStatus.FINALIZED) {
            return "exam/resultPending";
        }


        ExamResultView result =
                examResultService.getResultForSubmission(submissionId);
        
        if (rdUser != null) {
            result.setStudentName(rdUser.getFullName());
        }

        // System.out.println("✅ Result loaded");

        model.addAttribute("result", result);

        System.out.println("========== CONTROLLER → JSP ==========");

        if (result.getQuestions() != null) {
            for (var q : result.getQuestions()) {
                System.out.println(
                    "Q: " + q.getQuestionText() +
                    " | studentAnswer=" + q.getStudentAnswer()
                );
            }
        }

        System.out.println("=====================================");

        // System.out.println("⬅️ EXIT viewResult()");
        return "exam/examResult";
    }
    
    @GetMapping("/submission/{submissionId}/result/download")
    public void downloadResultPdf(@PathVariable Integer submissionId,
                                  HttpServletResponse response) {

        System.out.println("⬇️ DOWNLOAD RESULT PDF for submissionId=" + submissionId);

        response.setContentType("application/pdf");
        response.setHeader(
            "Content-Disposition",
            "attachment; filename=Exam_Result_" + submissionId + ".pdf"
        );

        System.out.println("========== CONTROLLER VIEW ==========");
        System.out.println("Opening submissionId = " + submissionId);
        System.out.println("=====================================");

        examResultService.generateResultPdf(submissionId, response);
    }

}
