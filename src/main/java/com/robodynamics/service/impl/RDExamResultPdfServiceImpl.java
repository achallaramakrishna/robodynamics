package com.robodynamics.service.impl;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import com.robodynamics.dao.RDExamAISummaryDAO;
import com.robodynamics.dao.RDExamAIEvaluationDAO;
import com.robodynamics.model.*;
import com.robodynamics.service.RDExamResultPdfService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class RDExamResultPdfServiceImpl
        implements RDExamResultPdfService {

    @Autowired
    private RDExamAISummaryDAO summaryDAO;

    @Autowired
    private RDExamAIEvaluationDAO evaluationDAO;

    @Override
    public void generateResultPdf(Integer submissionId, OutputStream out)
            throws Exception {

        RDExamAISummary summary =
                summaryDAO.findBySubmissionId(submissionId);

        List<RDExamAIEvaluation> evaluations =
                evaluationDAO.findBySubmissionIdOrderByQuestionOrder(submissionId);

        Document document = new Document(PageSize.A4, 36, 36, 36, 36);
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

        // ---------- TITLE ----------
        Paragraph title = new Paragraph("Exam Result", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        // ---------- SUMMARY ----------
        BigDecimal totalAwarded = BigDecimal.ZERO;
        BigDecimal totalMax = BigDecimal.ZERO;

        for (RDExamAIEvaluation ev : evaluations) {
            totalAwarded = totalAwarded.add(ev.getMarksAwarded());
            totalMax = totalMax.add(
                    BigDecimal.valueOf(
                            ev.getSectionQuestion().getMarks()
                    )
            );
        }

        PdfPTable summaryTable = new PdfPTable(2);
        summaryTable.setWidthPercentage(100);
        summaryTable.setSpacingBefore(10);

        summaryTable.addCell(cell("Score", headerFont));
        summaryTable.addCell(cell(
                totalAwarded + " / " + totalMax,
                bodyFont
        ));

        summaryTable.addCell(cell("Evaluated By", headerFont));
        summaryTable.addCell(cell(
                summary != null ? summary.getEvaluatedBy() : "AI",
                bodyFont
        ));

        document.add(summaryTable);
        document.add(Chunk.NEWLINE);

        // ---------- OVERALL FEEDBACK ----------
        document.add(new Paragraph("Overall Feedback", headerFont));
        document.add(new Paragraph(
                summary != null && summary.getOverallFeedback() != null
                        ? summary.getOverallFeedback()
                        : "No feedback available.",
                bodyFont
        ));
        document.add(Chunk.NEWLINE);

        // ---------- QUESTION-WISE TABLE ----------
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{5, 40, 12, 10, 33});

        table.addCell(cell("#", headerFont));
        table.addCell(cell("Question", headerFont));
        table.addCell(cell("Marks", headerFont));
        table.addCell(cell("Confidence", headerFont));
        table.addCell(cell("Feedback", headerFont));

        int index = 1;
        for (RDExamAIEvaluation ev : evaluations) {

            RDExamSectionQuestion sq = ev.getSectionQuestion();

            table.addCell(cell(String.valueOf(index++), bodyFont));
            table.addCell(cell(
                    sq.getQuestion().getQuestionText(),
                    bodyFont
            ));
            table.addCell(cell(
                    ev.getMarksAwarded() + " / " + sq.getMarks(),
                    bodyFont
            ));
            table.addCell(cell(
            		ev.getConfidence() != null
                    ? ev.getConfidence()
                            .multiply(BigDecimal.valueOf(100))
                            .setScale(0, RoundingMode.HALF_UP)
                            .toPlainString() + "%"
                    : "-"
,
                    bodyFont
            ));
            table.addCell(cell(
                    ev.getFeedback() != null
                            ? ev.getFeedback()
                            : "",
                    bodyFont
            ));
        }

        document.add(table);
        document.close();
    }

    private PdfPCell cell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setPadding(6);
        return cell;
    }
}
