package com.robodynamics.controller;

import com.robodynamics.service.RDExamResultPdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import javax.servlet.http.HttpServletResponse;

@Controller
public class RDExamResultPdfController {

    @Autowired
    private RDExamResultPdfService pdfService;

    @GetMapping("/student/exam/submission/{submissionId}/result-pdf")
    public void downloadResultPdf(
            @PathVariable Integer submissionId,
            HttpServletResponse response
    ) throws Exception {

        response.setContentType("application/pdf");
        response.setHeader(
            "Content-Disposition",
            "attachment; filename=Exam_Result_" + submissionId + ".pdf"
        );

        pdfService.generateResultPdf(submissionId, response.getOutputStream());
    }
}
