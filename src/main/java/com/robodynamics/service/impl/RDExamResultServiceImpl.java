package com.robodynamics.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.itextpdf.text.Document;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import java.awt.Color;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDExamResultDAO;
import com.robodynamics.dto.ExamQuestionResultRow;
import com.robodynamics.dto.ExamResultQuestionView;
import com.robodynamics.dto.ExamResultSummaryRow;
import com.robodynamics.dto.ExamResultView;
import com.robodynamics.dto.McqOptionView;
import com.robodynamics.service.RDExamResultService;

@Service
@Transactional(readOnly = true)
public class RDExamResultServiceImpl implements RDExamResultService {

    @Autowired
    private RDExamResultDAO examResultDAO;

    @Override
    public ExamResultView getResultForSubmission(Integer submissionId) {

        ExamResultView view = new ExamResultView();
        view.setSubmissionId(submissionId);
        
        System.out.println("========== PDF FETCH ==========");
        System.out.println("Fetching submissionId = " + submissionId);
        System.out.println("================================");


        /* =====================================================
           1️⃣ SUMMARY (SAFE, NULL-PROOF)
           ===================================================== */
        ExamResultSummaryRow summary =
                examResultDAO.getResultSummary(submissionId);

        BigDecimal awardedFromSubmission = null;
        BigDecimal totalMarks = BigDecimal.ZERO;

        if (summary != null) {

            // ✅ REQUIRED FOR MODEL ANSWER BUTTON
            view.setExamPaperId(summary.getExamPaperId());

            awardedFromSubmission = summary.getTotalMarksAwarded();

            if (summary.getTotalMarks() != null) {
                totalMarks = summary.getTotalMarks();
            }

            view.setOverallFeedback(summary.getOverallFeedback());

            // ✅ STUDENT ANSWER PDF EXISTS
            view.setStudentAnswerAvailable(true);
        } else {
            view.setStudentAnswerAvailable(false);
        }

        view.setTotalMarks(totalMarks.intValue());
        
        Object[] examMeta =
                examResultDAO.getExamMetaBySubmission(submissionId);

        if (examMeta != null) {
            view.setExamTitle((String) examMeta[0]);
            view.setSubject((String) examMeta[1]);
            view.setBoard((String) examMeta[2]);
            view.setExamYear(
                examMeta[3] != null ? ((Number) examMeta[3]).intValue() : null
            );
            view.setExamType((String) examMeta[4]);
            view.setDurationMinutes(
                examMeta[5] != null ? ((Number) examMeta[5]).intValue() : null
            );

            // Format exam date
            if (examMeta[6] != null) {
                view.setExamDate(
                    examMeta[6].toString().substring(0, 10)
                );
            }
        }


        /* =====================================================
           2️⃣ QUESTION-WISE DETAILS (AI MARKING VIEW)
           ===================================================== */
        List<ExamQuestionResultRow> rows =
                examResultDAO.getDetailedQuestionResult(submissionId);
        
        System.out.println("========== SERVICE: ROW OBJECTS ==========");

        for (ExamQuestionResultRow row : rows) {
            System.out.println(
                "Q: " + row.getQuestionText() +
                " | studentAnswer=" + row.getStudentAnswer()
            );
        }

        System.out.println("==========================================");


        List<ExamResultQuestionView> questions = new ArrayList<>();

        double calculatedAwarded = 0.0;

        for (ExamQuestionResultRow row : rows) {

            ExamResultQuestionView q = new ExamResultQuestionView();

            q.setSectionTitle(row.getSectionName());
            q.setQuestionText(row.getQuestionText());

            int maxMarks =
                    row.getMaxMarks() != null
                            ? row.getMaxMarks().intValue()
                            : 0;
            q.setMaxMarks(maxMarks);
            
            // ✅ FIX: COPY STUDENT ANSWER
            q.setStudentAnswer(row.getStudentAnswer());
            
            System.out.println(
            	    "SERVICE → VIEW MAP | Q: " + q.getQuestionText() +
            	    " | studentAnswer=" + q.getStudentAnswer()
            	);


            // ✅ ONLY MODEL ANSWER (NOT STUDENT ANSWER)
            q.setCorrectAnswer(row.getModelAnswer());
            
            q.setQuestionType(row.getQuestionType()); // <-- ensure DAO returns this


            double marks =
                    row.getMarksAwarded() != null
                            ? row.getMarksAwarded().doubleValue()
                            : 0.0;

            q.setMarksAwarded(marks);
            q.setFeedback(row.getFeedback());
            
            /* ================= MCQ OPTIONS ================= */
            if ("multiple_choice".equalsIgnoreCase(q.getQuestionType())) {

                List<Object[]> opts =
                        examResultDAO.getMcqOptions(q.getQuestionId());

                for (Object[] o : opts) {

                    String optionText = (String) o[0];
                    boolean isCorrect = ((Number) o[1]).intValue() == 1;
                    boolean selectedByStudent =
                            optionText.equalsIgnoreCase(q.getStudentAnswer());

                    q.getOptions().add(
                        new McqOptionView(optionText, isCorrect, selectedByStudent)
                    );
                }

           
        }
            
        calculatedAwarded += marks;
        questions.add(q);
        System.out.println("SERVICE → total questions: " + rows.size());
        System.out.println("SERVICE → total questions: " + questions.size());

        view.setQuestions(questions);

        /* =====================================================
           3️⃣ FALLBACK TOTAL (CRITICAL)
           ===================================================== */
        double finalAwardedMarks =
                (awardedFromSubmission != null)
                        ? awardedFromSubmission.doubleValue()
                        : calculatedAwarded;

        view.setTotalMarksAwarded(finalAwardedMarks);

        /* =====================================================
           4️⃣ REVIEW FLAG
           ===================================================== */
        view.setNeedsTeacherReview(
                awardedFromSubmission == null
        );

     // student answer PDF exists if submission had uploaded files
        view.setStudentAnswerAvailable(
            examResultDAO.hasStudentAnswerPdf(submissionId)
        );
        }
        return view;
    }

    @Override
    public void generateResultPdf(Integer submissionId, HttpServletResponse response) {

        ExamResultView result = getResultForSubmission(submissionId);

        try {
            response.setContentType("application/pdf");
            response.setHeader(
                "Content-Disposition",
                "attachment; filename=Exam_Result_" + submissionId + ".pdf"
            );

            Document document = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();

            /* ================= FONTS ================= */
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.WHITE);
            Font sectionFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font labelFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
            Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11);
            Font mutedFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, BaseColor.GRAY);

            /* ================= HEADER ================= */
            PdfPTable header = new PdfPTable(1);
            header.setWidthPercentage(100);

            PdfPCell headerCell = new PdfPCell(
                new Phrase("🎉 ROBO DYNAMICS – Exam Evaluation Report 🎉", headerFont)
            );
            headerCell.setBackgroundColor(new BaseColor(13, 110, 253));
            headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            headerCell.setPadding(16);
            headerCell.setBorder(Rectangle.NO_BORDER);

            header.addCell(headerCell);
            document.add(header);

            document.add(Chunk.NEWLINE);
            document.add(Chunk.NEWLINE);

            /* ================= STUDENT & EXAM DETAILS ================= */
            document.add(new Paragraph("👤 Student & Exam Details", sectionFont));
            document.add(Chunk.NEWLINE);

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(24);
            infoTable.setWidths(new int[]{1, 2});

            infoTable.addCell(infoCell("Student Name"));
            infoTable.addCell(infoValue(result.getStudentName()));

            infoTable.addCell(infoCell("Exam Title"));
            infoTable.addCell(infoValue(result.getExamTitle()));

            infoTable.addCell(infoCell("Subject"));
            infoTable.addCell(infoValue(result.getSubject()));

            infoTable.addCell(infoCell("Board"));
            infoTable.addCell(infoValue(result.getBoard()));

            infoTable.addCell(infoCell("Exam Year"));
            infoTable.addCell(infoValue(
                result.getExamYear() != null ? result.getExamYear().toString() : "-"
            ));

            infoTable.addCell(infoCell("Exam Type"));
            infoTable.addCell(infoValue(result.getExamType()));

            infoTable.addCell(infoCell("Exam Date"));
            infoTable.addCell(infoValue(result.getExamDate()));

            infoTable.addCell(infoCell("Duration"));
            infoTable.addCell(infoValue(
                result.getDurationMinutes() != null
                    ? result.getDurationMinutes() + " minutes"
                    : "-"
            ));

            document.add(infoTable);

            /* ================= SUMMARY STATS ================= */
            PdfPTable summary = new PdfPTable(3);
            summary.setWidthPercentage(100);
            summary.setSpacingAfter(28);
            summary.setWidths(new int[]{2, 2, 2});

            double percentage =
                (result.getTotalMarks() != null && result.getTotalMarks() > 0)
                    ? (result.getTotalMarksAwarded() / result.getTotalMarks()) * 100
                    : 0;

            summary.addCell(makeStatCell(
                "🌟 Marks Obtained",
                result.getTotalMarksAwarded() + " / " + result.getTotalMarks(),
                new BaseColor(25, 135, 84)
            ));

            summary.addCell(makeStatCell(
                "🏆 Performance",
                getPerformanceLabel(percentage),
                new BaseColor(13, 110, 253)
            ));

            summary.addCell(makeStatCell(
                "🆔 Submission ID",
                String.valueOf(result.getSubmissionId()),
                new BaseColor(13, 202, 240)
            ));

            document.add(summary);

            /* ================= OVERALL FEEDBACK ================= */
            document.add(new Paragraph("📝 Overall Feedback", sectionFont));
            document.add(Chunk.NEWLINE);

            PdfPCell fbCell = new PdfPCell(
                new Phrase(result.getOverallFeedback(), normalFont)
            );
            fbCell.setBackgroundColor(new BaseColor(248, 249, 250));
            fbCell.setPadding(14);
            fbCell.setBorderColor(new BaseColor(220, 220, 220));

            PdfPTable fbTable = new PdfPTable(1);
            fbTable.setWidthPercentage(100);
            fbTable.setSpacingAfter(36); // 🔥 prevents overlap
            fbTable.addCell(fbCell);

            document.add(fbTable);

            /* ================= QUESTIONS ================= */
            document.add(new Paragraph("📊 Question-wise Detailed Evaluation", sectionFont));
            document.add(Chunk.NEWLINE);

            int qNo = 1;

            for (ExamResultQuestionView q : result.getQuestions()) {

                document.add(new Paragraph(
                    "Q" + qNo++ + ". " + q.getQuestionText(),
                    labelFont
                ));

                document.add(new Paragraph(
                    "Marks: " + q.getMarksAwarded() + " / " + q.getMaxMarks(),
                    mutedFont
                ));

                document.add(Chunk.NEWLINE);

                BaseColor answerColor;

                if (q.getMarksAwarded() == 0) {
                    answerColor = new BaseColor(248, 215, 218); // ❌ light red
                } else if (q.getMarksAwarded() == q.getMaxMarks()) {
                    answerColor = new BaseColor(212, 237, 218); // ✅ light green
                } else {
                    answerColor = new BaseColor(255, 243, 205); // ⚠️ light yellow
                }

             // ================= MCQ OPTIONS =================
                if ("multiple_choice".equalsIgnoreCase(q.getQuestionType())) {

                    PdfPTable optTable = new PdfPTable(1);
                    optTable.setWidthPercentage(100);
                    optTable.setSpacingAfter(8);

                    char label = 'A';

                    for (McqOptionView opt : q.getOptions()) {

                        String prefix = label++ + ". ";
                        String text = prefix + opt.getOptionText();

                        BaseColor bg = BaseColor.WHITE;

                        if (opt.isSelectedByStudent() && opt.isCorrect()) {
                            bg = new BaseColor(212, 237, 218); // ✅ green
                        } else if (opt.isSelectedByStudent()) {
                            bg = new BaseColor(248, 215, 218); // ❌ red
                        } else if (opt.isCorrect()) {
                            bg = new BaseColor(255, 243, 205); // ⚠️ yellow
                        }

                        PdfPCell cell = new PdfPCell(new Phrase(text, normalFont));
                        cell.setBackgroundColor(bg);
                        cell.setPadding(6);
                        cell.setBorderColor(new BaseColor(220, 220, 220));

                        optTable.addCell(cell);
                    }

                    document.add(optTable);

                } else {

                    // ================= NON-MCQ =================
                    document.add(makeAnswerBlock(
                        "🧑‍🎓 Your Answer",
                        q.getStudentAnswer(),
                        answerColor
                    ));
                }



                document.add(Chunk.NEWLINE);

                document.add(makeAnswerBlock(
                    "✅ Correct Answer",
                    q.getCorrectAnswer(),
                    new BaseColor(212, 237, 218)
                ));

                document.add(Chunk.NEWLINE);

                document.add(makeAnswerBlock(
                    "📝 Feedback",
                    q.getFeedback(),
                    new BaseColor(248, 249, 250)
                ));

                document.add(Chunk.NEWLINE);
                document.add(new LineSeparator());
                document.add(Chunk.NEWLINE);
            }

            /* ================= CTA ================= */
            document.add(Chunk.NEWLINE);
            document.add(new Paragraph("📘 Why Robo Dynamics ExamPrep?", sectionFont));
            document.add(Chunk.NEWLINE);

            document.add(new Paragraph(
                "✔ Concept-wise AI evaluation\n" +
                "✔ Step-by-step feedback\n" +
                "✔ Parent-visible progress tracking\n" +
                "✔ Designed for exam confidence",
                normalFont
            ));

            document.add(Chunk.NEWLINE);
            document.add(new Paragraph(
                "This report is generated using Robo Dynamics AI Evaluation System.",
                mutedFont
            ));

            document.close();
            System.out.println("✅ Premium PDF generated successfully");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to generate result PDF", e);
        }
    }

    
    private PdfPCell makeStatCell(String title, String value, BaseColor color) {
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, color);
        Font valueFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);

        PdfPCell cell = new PdfPCell();
        cell.setPadding(10);
        cell.addElement(new Paragraph(title, titleFont));
        cell.addElement(new Paragraph(value, valueFont));
        cell.setBorderColor(color);
        return cell;
    }

    private PdfPTable makeAnswerBlock(String title, String text, BaseColor bg) {
        PdfPTable table = new PdfPTable(1);
        table.setWidthPercentage(100);

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
        Font textFont = FontFactory.getFont(FontFactory.HELVETICA, 11);

        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(bg);
        cell.setPadding(8);
        cell.addElement(new Paragraph(title, titleFont));
        cell.addElement(new Paragraph(
                text != null && !text.trim().isEmpty() ? text : "No answer provided.",
                textFont));

        table.addCell(cell);
        return table;
    }
    
    private PdfPCell infoCell(String text) {
        Font f = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
        PdfPCell c = new PdfPCell(new Phrase(text, f));
        c.setPadding(8);
        c.setBackgroundColor(new BaseColor(248, 249, 250));
        return c;
    }

    private PdfPCell infoValue(String text) {
        Font f = FontFactory.getFont(FontFactory.HELVETICA, 11);
        PdfPCell c = new PdfPCell(new Phrase(
            text != null ? text : "-", f
        ));
        c.setPadding(8);
        return c;
    }


    private String getPerformanceLabel(double percentage) {
        if (percentage >= 85) return "Excellent 🌟";
        if (percentage >= 65) return "Good Job 👏";
        if (percentage >= 40) return "Keep Practicing 🙂";
        return "Needs Support 💪";
    }


}
