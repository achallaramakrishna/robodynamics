package com.robodynamics.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.OutputStream;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.service.RDExamSubmissionFileService;

@Controller
@RequestMapping("/exam/submission")
public class RDExamSubmissionController {

    @Autowired
    private RDExamSubmissionFileService submissionFileService;

    @GetMapping("/{submissionId}/student-answer")
    public void viewStudentAnswerPdf(
            @PathVariable Integer submissionId,
            HttpServletResponse response) {

        File pdf = submissionFileService.getStudentAnswerPdf(submissionId);
        
        System.out.println("pdf - " + pdf.getAbsolutePath());
        if (pdf == null || !pdf.exists()) {
            try {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("Student answer PDF not found");
                response.getWriter().flush();
            } catch (Exception ignored) {}
            return;
        }

        response.setContentType("application/pdf");
        response.setHeader(
            "Content-Disposition",
            "inline; filename=student-answer.pdf"
        );

        try (FileInputStream fis = new FileInputStream(pdf);
             OutputStream os = response.getOutputStream()) {

            fis.transferTo(os);
            os.flush();

        } catch (Exception e) {
            throw new RuntimeException("Failed to stream student answer PDF", e);
        }
    }

}
