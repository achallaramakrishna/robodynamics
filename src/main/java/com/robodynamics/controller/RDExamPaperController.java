package com.robodynamics.controller;

import java.util.HashMap;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDExamSection;
import com.robodynamics.model.RDExamSectionQuestion;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDExamPaperService;
import com.robodynamics.wrapper.CourseSessionDetailJson;
import com.robodynamics.wrapper.CourseSessionJson;
import com.robodynamics.dto.RDExamPaperUploadDTO;

@Controller
@RequestMapping("/exam")
public class RDExamPaperController {

    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    @Autowired
    private RDExamPaperService examPaperService;

    private final ObjectMapper mapper = new ObjectMapper();

    /* =========================================================
       PAGE: Upload / Manage Exam Papers
       ========================================================= */
    @GetMapping("/upload")
    public String showUploadPage(Model model) {

        model.addAttribute("courses", courseService.getRDCourses());
        return "exam/uploadExamPaper";
    }

    /* =========================================================
       AJAX: Course Sessions
       ========================================================= */
    @GetMapping("/getCourseSessions")
    @ResponseBody
    public List<CourseSessionJson> getCourseSessions(
            @RequestParam Integer courseId) {

        return courseSessionService
                .getCourseSessionsByCourseId(courseId)
                .stream()
                .map(s -> {
                    CourseSessionJson dto = new CourseSessionJson();
                    dto.setSessionId(s.getCourseSessionId());
                    dto.setSessionTitle(s.getSessionTitle());
                    dto.setGrade(s.getGrade());
                    dto.setSessionType(s.getSessionType());
                    dto.setSessionDescription(s.getSessionDescription());
                    if (s.getTierLevel() != null) {
                        dto.setTierLevel(s.getTierLevel().name());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /* =========================================================
       AJAX: Session Details
       ========================================================= */
    @GetMapping("/getSessionDetails")
    @ResponseBody
    public List<CourseSessionDetailJson> getSessionDetails(
            @RequestParam Integer sessionId) {

        return courseSessionDetailService
                .findSessionDetailsBySessionId(sessionId)
                .stream()
                .map(d -> {
                    CourseSessionDetailJson dto = new CourseSessionDetailJson();
                    dto.setSessionId(d.getCourseSession().getCourseSessionId());
                    dto.setSessionDetailId(d.getCourseSessionDetailId());
                    dto.setTopic(d.getTopic());
                    dto.setType(d.getType());
                    dto.setFile(d.getFile());
                    if (d.getTierLevel() != null) {
                        dto.setTierLevel(d.getTierLevel().name());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /* =========================================================
       POST: Upload Exam Paper JSON
       ========================================================= */
    @PostMapping("/uploadJson")
    public String uploadExamPaperJson(
            @RequestParam("file") MultipartFile file,
            @RequestParam Integer courseSessionId,
            @RequestParam Integer courseSessionDetailId,
            RedirectAttributes redirectAttributes,
            HttpSession session) {

        RDUser user = (RDUser) session.getAttribute("rdUser");

        if (file == null || file.isEmpty()) {
            redirectAttributes.addFlashAttribute(
                    "error", "Please upload a valid JSON file.");
            return "redirect:/exam/upload";
        }

        try {
            RDExamPaperUploadDTO uploadDTO =
                    mapper.readValue(file.getInputStream(), RDExamPaperUploadDTO.class);

            examPaperService.createExamPaperFromJson(
                    uploadDTO,
                    courseSessionId,
                    courseSessionDetailId,
                    user
            );

            redirectAttributes.addFlashAttribute(
                    "success", "Exam paper uploaded successfully.");

        } catch (Exception ex) {
            ex.printStackTrace();
            redirectAttributes.addFlashAttribute(
                    "error", "Upload failed: " + ex.getMessage());
        }

        return "redirect:/exam/upload";
    }

    @GetMapping(
    	    value = "/getExamPapersBySessionDetail",
    	    produces = "application/json"
	)
	@ResponseBody
	@Transactional(readOnly = true)
    public List<Map<String, Object>> getExamPapersBySessionDetail(
            @RequestParam Integer sessionDetailId) {

        return examPaperService
                .getExamPapersBySessionDetail(sessionDetailId);
                
    }


    /* =========================================================
       VIEW: Exam Paper Preview
       ========================================================= */
    @GetMapping("/view")
    public String viewExamPaper(
            @RequestParam Integer examPaperId,
            Model model) {

        RDExamPaper examPaper =
                examPaperService.getExamPaperWithDetails(examPaperId);

        model.addAttribute("examPaper", examPaper);
        return "exam/viewExamPaper";
    }

    /* =========================================================
       DELETE: Exam Paper
       ========================================================= */
    @GetMapping("/delete")
    public String deleteExamPaper(
            @RequestParam Integer examPaperId,
            RedirectAttributes redirectAttributes) {

        examPaperService.deleteExamPaper(examPaperId);
        redirectAttributes.addFlashAttribute(
                "success", "Exam paper deleted successfully.");

        return "redirect:/exam/upload";
    }

    /* =========================================================
       DOWNLOAD PDF (HOOK)
       ========================================================= */
    @GetMapping("/downloadPdf")
    public void downloadPdf(
            @RequestParam Integer examPaperId,
            HttpServletResponse response) {

        try {
            RDExamPaper examPaper =
                    examPaperService.getExamPaperWithDetails(examPaperId);

            response.setContentType("application/pdf");
            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=ExamPaper_" + examPaperId + ".pdf"
            );

            OutputStream out = response.getOutputStream();

            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter.getInstance(document, out);
            document.open();

            /* ================= FONTS ================= */
            Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 11, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 11);
            Font smallFont = new Font(Font.HELVETICA, 10);

            /* ================= TITLE ================= */
            Paragraph title = new Paragraph(examPaper.getTitle(), titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph(
                    "Subject: " + examPaper.getSubject()
                            + " | Time: " + examPaper.getDurationMinutes() + " mins"
                            + " | Marks: " + examPaper.getTotalMarks(),
                    smallFont
            ));

            document.add(Chunk.NEWLINE);

            /* ================= INSTRUCTIONS ================= */
            if (examPaper.getInstructions() != null) {
                document.add(new Paragraph("Instructions", headerFont));
                document.add(new Paragraph(examPaper.getInstructions(), normalFont));
                document.add(Chunk.NEWLINE);
            }

            /* ================= SECTIONS ================= */
            for (RDExamSection section : examPaper.getSections()) {

                Paragraph sectionTitle = new Paragraph(
                        "Section " + section.getSectionName()
                                + " (" +
                                (section.getAttemptType() == RDExamSection.AttemptType.ALL
                                        ? "Answer all questions"
                                        : "Attempt any " + section.getAttemptCount())
                                + ")",
                        headerFont
                );
                document.add(sectionTitle);
                document.add(Chunk.NEWLINE);

                int qNo = 1;
                for (RDExamSectionQuestion sq : section.getQuestions()) {

                    Paragraph q = new Paragraph(
                            qNo + ". " + sq.getQuestion().getQuestionText()
                                    + " (" + sq.getMarks() + ")",
                            normalFont
                    );
                    document.add(q);

                    /* ===== MCQ OPTIONS ===== */
                    if ("MCQ".equalsIgnoreCase(sq.getQuestion().getQuestionType())) {
                        char optLabel = 'A';
                        for (RDQuizOption opt : sq.getQuestion().getOptions()) {
                            document.add(new Paragraph(
                                    "   " + optLabel + ". " + opt.getOptionText(),
                                    smallFont
                            ));
                            optLabel++;
                        }
                    }

                    document.add(Chunk.NEWLINE);
                    qNo++;
                }

                document.add(Chunk.NEWLINE);
            }

            document.close();
            out.close();

        } catch (Exception e) {
            throw new RuntimeException("PDF generation failed", e);
        }
    }
}
