package com.robodynamics.controller;

import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
//===== Spring =====
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lowagie.text.Chunk;
//===== iText / OpenPDF =====
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.ColumnText;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import com.robodynamics.dto.RDExamPaperUploadDTO;
import com.robodynamics.model.RDExamAnswerKey;
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

@Controller
@RequestMapping("/exam")
public class RDExamPaperController {
	
	
	@Value("${file.storage.disk-root:/opt/robodynamics}")
	private String diskRoot;


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
    @ResponseBody
    public ResponseEntity<?> uploadExamPaperJson(
            @RequestParam("file") MultipartFile file,
            @RequestParam Integer courseSessionId,
            @RequestParam Integer courseSessionDetailId,
            HttpSession session) {

    	System.out.println(">>> uploadExamPaperJson HIT <<<");

        RDUser user = (RDUser) session.getAttribute("rdUser");

        try {
            RDExamPaperUploadDTO dto =
                    mapper.readValue(file.getInputStream(), RDExamPaperUploadDTO.class);

            examPaperService.upsertExamPaperFromJson(
                    dto, courseSessionId, courseSessionDetailId, user);

            return ResponseEntity.ok(
                Map.of("status", "SUCCESS", "message", "Exam paper saved successfully"));

        } catch (Exception e) {
        	e.printStackTrace(); // 🔥 ADD THIS
            return ResponseEntity.status(500).body(
                Map.of("status", "ERROR", "message", e.getMessage()));
        }
    }



    @GetMapping(
    	    value = "/getExamPapersBySessionDetail",
    	    produces = "application/json"
	)
    @ResponseBody
    @Transactional(readOnly = true)
    public RDExamPaper getExamPapersBySessionDetail(@RequestParam Integer sessionDetailId) {
        return examPaperService.getExamPapersBySessionDetail(sessionDetailId);
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
    VIEW: Model Answer
    ========================================================= */
    @GetMapping("/paper/{examPaperId}/model-answer")
    @Transactional(readOnly = true)
    public String viewModelAnswer(
            @PathVariable Integer examPaperId,
            Model model) {

        RDExamPaper examPaper =
                examPaperService.getExamPaperWithDetails(examPaperId);

        List<RDExamAnswerKey> answerKeys =
                examPaperService.getAnswerKeysByExamPaper(examPaperId);

        Map<Integer, RDExamAnswerKey> answerKeyMap =
                answerKeys.stream()
                    .collect(Collectors.toMap(
                        ak -> ak.getSectionQuestion().getId(),
                        ak -> ak
                    ));

        model.addAttribute("examPaper", examPaper);
        model.addAttribute("answerKeyMap", answerKeyMap);

        return "exam/viewModelAnswer";
    }

    private int calculateAnswerLines(Integer marks) {

        if (marks == null) return 5;

        if (marks <= 1) return 3;
        if (marks == 2) return 5;
        if (marks == 3) return 7;
        if (marks == 4) return 10;
        if (marks >= 5) return 14;

        return marks * 3;
    }

    private void addAnswerLines(Document document, int numberOfLines)
            throws DocumentException {

        for (int i = 0; i < numberOfLines; i++) {

            LineSeparator line = new LineSeparator();
            line.setLineWidth(0.6f);
            line.setPercentage(100);

            document.add(new Chunk(line));
            document.add(new Paragraph(" "));
        }
    }

    class Footer extends PdfPageEventHelper {

        @Override
        public void onEndPage(PdfWriter writer, Document document) {

            ColumnText.showTextAligned(
                    writer.getDirectContent(),
                    Element.ALIGN_CENTER,
                    new Phrase("Page " + writer.getPageNumber(),
                            new Font(Font.HELVETICA, 9)),
                    (document.right() - document.left()) / 2 + document.leftMargin(),
                    document.bottom() - 10,
                    0);
        }
    }


    private Image loadPdfImage(String storedPath) {
        try {
            if (storedPath == null || storedPath.isEmpty()) return null;

            String p = storedPath.replace("\\", "/");

            // Remove context path if present
            if (p.startsWith("/robodynamics/")) {
                p = p.substring("/robodynamics/".length());
            }

            // Remove leading slash
            if (p.startsWith("/")) {
                p = p.substring(1);
            }

            // Final FS path: /opt/robodynamics/uploads/...
            Path imgPath = Paths.get(diskRoot).resolve(p);

            if (!Files.exists(imgPath)) return null;

            Image img = Image.getInstance(imgPath.toAbsolutePath().toString());
            img.scaleToFit(400, 250); // ✅ safe size for A4
            img.setSpacingBefore(5);
            img.setSpacingAfter(5);
            return img;

        } catch (Exception e) {
            return null; // fail silently to avoid PDF crash
        }
    }

    /* =========================================================
       DOWNLOAD PDF (HOOK)
       ========================================================= */
    @GetMapping("/downloadPdf")
    public void downloadPdf(
            @RequestParam Integer examPaperId,
            HttpServletResponse response) {

        try {
        	
        	System.out.println("hello ...");
            RDExamPaper examPaper =
                    examPaperService.getExamPaperWithDetails(examPaperId);

            response.setContentType("application/pdf");
            response.setHeader(
                    "Content-Disposition",
                    "attachment; filename=ExamPaper_" + examPaperId + ".pdf"
            );

            OutputStream out = response.getOutputStream();

            Document document = new Document(PageSize.A4, 40, 40, 50, 50);
            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setPageEvent(new Footer());

            document.open();

            /* ================= FONTS ================= */
            Font titleFont = new Font(Font.HELVETICA, 14, Font.BOLD);
            Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);
            Font normalFont = new Font(Font.HELVETICA, 11);
            Font smallFont = new Font(Font.HELVETICA, 10);

            /* ================= HEADER ================= */

            Paragraph board = new Paragraph("ROBO DYNAMICS", titleFont);
            board.setAlignment(Element.ALIGN_CENTER);
            document.add(board);

            Paragraph examTitle = new Paragraph(
                    "CBSE Examination – " + examPaper.getExamYear(),
                    headerFont);
            examTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(examTitle);

            document.add(new Paragraph(
                    "Subject: " + examPaper.getSubject()
                            + "        Time: " + examPaper.getDurationMinutes() + " Minutes"
                            + "        Maximum Marks: " + examPaper.getTotalMarks(),
                    normalFont));

            document.add(Chunk.NEWLINE);

            /* ================= STUDENT DETAILS ================= */

            document.add(new Paragraph("Student Name: ________________________________", normalFont));
            document.add(new Paragraph("Roll No: ____________________________________", normalFont));
            document.add(new Paragraph("Class & Section: ____________________________", normalFont));
            document.add(Chunk.NEWLINE);

            /* ================= SECTIONS + QUESTIONS ================= */

            int qNo = 1;

            for (RDExamSection section : examPaper.getSections()) {

                Paragraph sectionTitle = new Paragraph(
                        "SECTION " + section.getSectionName(),
                        headerFont);
                sectionTitle.setAlignment(Element.ALIGN_CENTER);
                document.add(sectionTitle);

                document.add(Chunk.NEWLINE);

                for (RDExamSectionQuestion sq : section.getQuestions()) {

                    PdfPTable table = new PdfPTable(new float[]{0.9f, 0.1f});
                    table.setWidthPercentage(100);

                    PdfPCell questionCell = new PdfPCell(
                            new Phrase("Q" + qNo + ". "
                                    + sq.getQuestion().getQuestionText(),
                                    normalFont));
                    questionCell.setBorder(Rectangle.NO_BORDER);

                    PdfPCell marksCell = new PdfPCell(
                            new Phrase("(" + sq.getMarks() + ")",
                                    normalFont));
                    marksCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                    marksCell.setBorder(Rectangle.NO_BORDER);

                    table.addCell(questionCell);
                    table.addCell(marksCell);

                    document.add(table);
                    
                    /* ===== QUESTION IMAGE ===== */
                    Image qImg = loadPdfImage(sq.getQuestion().getQuestionImage());
                    if (qImg != null) {
                        document.add(qImg);
                    }


                    /* ===== MCQ OPTIONS ===== */

                    /* ===== MCQ OPTIONS WITH STUDENT PLACEHOLDER ===== */

                    if ("multiple_choice".equalsIgnoreCase(
                            sq.getQuestion().getQuestionType())) {

                        char opt = 'A';

                        for (RDQuizOption option : sq.getQuestion().getOptions()) {

                            // ⬜ Placeholder for student selection
                            Paragraph optLine = new Paragraph(
                                "   ⬜  " + opt + ". " + option.getOptionText(),
                                smallFont
                            );
                            optLine.setSpacingBefore(3);
                            optLine.setSpacingAfter(3);
                            document.add(optLine);

                            // Option image (if any)
                            Image optImg = loadPdfImage(option.getOptionImage());
                            if (optImg != null) {
                                optImg.scaleToFit(280, 180);
                                optImg.setIndentationLeft(25);
                                document.add(optImg);
                            }

                            opt++;
                        }

                        

                        document.add(Chunk.NEWLINE);

                        // Optional instruction line (very exam-like)
                        document.add(new Paragraph(
                            "   (Select the correct option)",
                            smallFont
                        ));
                    }


                    document.add(Chunk.NEWLINE);

                    /* ===== Dynamic Writing Space ===== */

                    int lines = calculateAnswerLines(sq.getMarks());
                    addAnswerLines(document, lines);

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
