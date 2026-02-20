package com.robodynamics.service.impl;

import com.robodynamics.dao.RDExamSubmissionDAO;
import com.robodynamics.model.RDExamSubmission;
import com.robodynamics.service.RDExamSubmissionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class RDExamSubmissionServiceImpl
        implements RDExamSubmissionService {

    @Value("${rd.uploads.root}")
    private String uploadsRoot;

    @Autowired
    private RDExamSubmissionDAO submissionDAO;

    /* =====================================================
       CREATE DRAFT + SUBMIT SUBMISSION
       ===================================================== */
    
    
    @Override
    @Transactional
    public RDExamSubmission createDraftSubmission(
            Integer examPaperId,
            Integer studentId,
            MultipartFile[] files
    ) {

        // // System.out.println("➡️ [SERVICE] createDraftSubmission()");
        // // System.out.println("   examPaperId=" + examPaperId + ", studentId=" + studentId);

        RDExamSubmission submission =
                submissionDAO.findLatestByExamAndStudent(examPaperId, studentId);

        /* =====================================================
           🔒 HARD STATE GATE
           ===================================================== */
        if (submission != null &&
            submission.getStatus() != RDExamSubmission.SubmissionStatus.DRAFT) {

            // // System.out.println("🚫 BLOCKED re-upload");
            // System.out.println("   submissionId=" + submission.getSubmissionId());
            // System.out.println("   currentStatus=" + submission.getStatus());

            // ❌ Do NOT overwrite files
            return submission;
        }

        boolean isNew = false;

        if (submission == null) {
            // System.out.println("🆕 Creating NEW submission");

            submission = new RDExamSubmission();
            submission.setExamPaperId(examPaperId);
            submission.setStudentId(studentId);
            submission.setAttemptNo(1);
            submission.setStatus(RDExamSubmission.SubmissionStatus.DRAFT);
            submission.setSubmittedAt(LocalDateTime.now());

            submissionDAO.save(submission);
            isNew = true;

            // System.out.println("✅ New submissionId=" + submission.getSubmissionId());
        } else {
            // System.out.println("♻️ Updating existing DRAFT submissionId="  + submission.getSubmissionId());

            submission.setSubmittedAt(LocalDateTime.now());

            Path oldDir = Paths.get(
                    uploadsRoot,
                    "exams",
                    examPaperId.toString(),
                    studentId.toString(),
                    submission.getSubmissionId().toString()
            );

            try {
                if (Files.exists(oldDir)) {
                    Files.walk(oldDir)
                            .sorted(Comparator.reverseOrder())
                            .map(Path::toFile)
                            .forEach(File::delete);
                }
            } catch (Exception e) {
                throw new RuntimeException("Failed to clear old submission files", e);
            }
        }

        /* =====================================================
           SAVE FILES
           ===================================================== */
        Path submissionDir = Paths.get(
                uploadsRoot,
                "exams",
                examPaperId.toString(),
                studentId.toString(),
                submission.getSubmissionId().toString()
        );

        try {
            Files.createDirectories(submissionDir);
        } catch (Exception e) {
            throw new RuntimeException("Unable to create upload directory", e);
        }

        List<String> savedFilePaths = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;

            try {
                String safeFileName =
                        System.currentTimeMillis() + "_" +
                        file.getOriginalFilename()
                                .replaceAll("[^a-zA-Z0-9._-]", "_");

                Path destination = submissionDir.resolve(safeFileName);
                file.transferTo(destination.toFile());

                savedFilePaths.add(destination.toString().replace("\\", "/"));

            } catch (Exception e) {
                throw new RuntimeException(
                        "Failed to store file: " + file.getOriginalFilename(), e
                );
            }
        }

        /* =====================================================
           FINALIZE — ONLY DRAFT → SUBMITTED
           ===================================================== */
        submission.setFilePaths(savedFilePaths);

        if (submission.getStatus() == RDExamSubmission.SubmissionStatus.DRAFT) {
            submission.setStatus(RDExamSubmission.SubmissionStatus.SUBMITTED);
        }

        submissionDAO.update(submission);

        // System.out.println("✅ Submission finalized");
        // System.out.println("   status=" + submission.getStatus());

        return submission;
    }

    /* =====================================================
       GET LATEST SUBMISSION
       ===================================================== */
    @Override
    @Transactional(readOnly = true)
    public RDExamSubmission getLatestSubmission(
            Integer examPaperId,
            Integer studentId
    ) {

        // System.out.println("➡️ [SERVICE] getLatestSubmission()");
        // System.out.println("   examPaperId=" + examPaperId);
        // System.out.println("   studentId=" + studentId);

        RDExamSubmission sub =
                submissionDAO.findLatestByExamAndStudent(examPaperId, studentId);

        // System.out.println("   result=" + (sub == null ? "NULL" : ("id=" + sub.getSubmissionId() + ", status=" + sub.getStatus())));

        return sub;
    }

    /* =====================================================
       GET BY ID
       ===================================================== */
    @Override
    @Transactional(readOnly = true)
    public RDExamSubmission getSubmissionById(Integer submissionId) {

        // System.out.println("➡️ [SERVICE] getSubmissionById(), submissionId=" + submissionId);

        RDExamSubmission sub = submissionDAO.findById(submissionId);

        // System.out.println("   found=" + (sub != null));
        return sub;
    }

    /* =====================================================
       SESSION VIEW MAP
       ===================================================== */
    @Override
    @Transactional(readOnly = true)
    public Map<Integer, RDExamSubmission>
    getStudentSubmissionsForSession(Integer studentId, Integer sessionId) {

        // System.out.println("➡️ [SERVICE] getStudentSubmissionsForSession()");
        // System.out.println("   studentId=" + studentId);
        // System.out.println("   sessionId=" + sessionId);

        List<RDExamSubmission> submissions =
                submissionDAO.findByStudentAndSession(studentId, sessionId);

        // System.out.println("   submissions fetched=" + submissions.size());

        Map<Integer, RDExamSubmission> submissionMap = new HashMap<>();

        for (RDExamSubmission submission : submissions) {
            Integer examPaperId =
                    submission.getExamPaper().getExamPaperId();

            // System.out.println("   mapping examPaperId=" + examPaperId +  " → submissionId=" + submission.getSubmissionId());

            submissionMap.putIfAbsent(examPaperId, submission);
        }

        // // System.out.println("   final map size=" + submissionMap.size());
        return submissionMap;
    }

    /* =====================================================
       GET BY ID WITH FILES
       ===================================================== */
    @Override
    @Transactional(readOnly = true)
    public RDExamSubmission getByIdWithFiles(Integer submissionId) {

        // // System.out.println("➡️ [SERVICE] getByIdWithFiles(), submissionId=" + submissionId);

        RDExamSubmission sub = submissionDAO.findByIdWithFiles(submissionId);

        if (sub != null) {
            // System.out.println("   status=" + sub.getStatus());
            // System.out.println("   files=" + (sub.getFilePaths() == null ? 0 : sub.getFilePaths().size()));
        } else {
            // System.out.println("   submission NOT FOUND");
        }

        return sub;
    }

    /* =====================================================
       FORCE MARK EVALUATING
       ===================================================== */
    @Override
    public void markEvaluating(Integer submissionId) {

        // System.out.println("➡️ [SERVICE] markEvaluating(), submissionId=" + submissionId);

        RDExamSubmission submission =
                submissionDAO.findById(submissionId);

        if (submission == null) {
            // System.out.println("🔥 Submission not found");
            throw new IllegalArgumentException(
                "Submission not found: " + submissionId
            );
        }

        // System.out.println("   currentStatus=" + submission.getStatus());

        submission.setStatus(
            RDExamSubmission.SubmissionStatus.EVALUATING
        );

        submissionDAO.update(submission);

        // System.out.println("   status updated to EVALUATING");
    }

    /* =====================================================
       MARK AS AI EVALUATED
       ===================================================== */
    @Override
    public void markEvaluated(Integer submissionId) {

        // System.out.println("➡️ [SERVICE] markEvaluated(), submissionId=" + submissionId);

        RDExamSubmission submission =
                submissionDAO.findById(submissionId);

        if (submission == null) {
            // System.out.println("🔥 Submission not found");
            throw new IllegalArgumentException(
                "Submission not found: " + submissionId
            );
        }

        // System.out.println("   currentStatus=" + submission.getStatus());

        submission.setStatus(
            RDExamSubmission.SubmissionStatus.AI_EVALUATED
        );

        submissionDAO.update(submission);

        // System.out.println("   status updated to AI_EVALUATED");
    }

    /* =====================================================
       ATOMIC STATUS TRANSITION
       ===================================================== */
    @Override
    public boolean markEvaluatingIfAllowed(Integer submissionId) {

        // System.out.println("➡️ [SERVICE] markEvaluatingIfAllowed()");
        // System.out.println("   submissionId=" + submissionId);

        int updated =
                submissionDAO.markEvaluatingIfSubmitted(submissionId);

        // System.out.println("   rowsUpdated=" + updated);

        return updated == 1;
    }

	@Override
	public RDExamSubmission findLatestByStudentAndPaper(Integer studentId, Integer paperId) {
		// TODO Auto-generated method stub
		return submissionDAO.findLatestByStudentAndPaper(studentId,paperId);
	}

}
