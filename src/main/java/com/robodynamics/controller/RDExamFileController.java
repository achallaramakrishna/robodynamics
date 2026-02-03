package com.robodynamics.controller;

import com.robodynamics.model.RDExamSubmission;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDExamSubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class RDExamFileController {

    @Autowired
    private RDExamSubmissionService submissionService;

    /**
     * Securely stream an uploaded exam answer file
     * URL: /files/view?submissionId=XX&index=YY
     */
    @GetMapping("/files/view")
    public void viewFile(
            @RequestParam("submissionId") Integer submissionId,
            @RequestParam("index") int index,
            HttpSession session,
            HttpServletResponse response
    ) throws IOException {

        /* =====================
           1️⃣ AUTH CHECK
           ===================== */
        RDUser user = (RDUser) session.getAttribute("rdUser");
        if (user == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        /* =====================
           2️⃣ LOAD SUBMISSION
           ===================== */
        RDExamSubmission submission =
                submissionService.getByIdWithFiles(submissionId);

        if (submission == null) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        /* =====================
           3️⃣ OWNERSHIP CHECK
           ===================== */
        if (!submission.getStudentId().equals(user.getUserID())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
            return;
        }

        /* =====================
           4️⃣ INDEX VALIDATION
           ===================== */
        if (index < 0 || index >= submission.getFilePaths().size()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }

        /* =====================
           5️⃣ FILE RESOLUTION
           ===================== */
        String filePath = submission.getFilePaths().get(index);
        Path path = Paths.get(filePath);

        if (!Files.exists(path)) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
            return;
        }

        /* =====================
           6️⃣ CONTENT TYPE
           ===================== */
        String contentType = Files.probeContentType(path);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        /* =====================
           7️⃣ RESPONSE HEADERS
           ===================== */
        response.setContentType(contentType);
        response.setHeader(
                "Content-Disposition",
                "inline; filename=\"" + path.getFileName().toString() + "\""
        );
        response.setContentLengthLong(Files.size(path));

        /* =====================
           8️⃣ STREAM FILE
           ===================== */
        Files.copy(path, response.getOutputStream());
        response.getOutputStream().flush();
    }
}
