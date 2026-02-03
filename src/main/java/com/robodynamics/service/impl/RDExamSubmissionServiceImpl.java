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

        // 1️⃣ Check existing submission (LATEST)
        RDExamSubmission submission =
                submissionDAO.findLatestByExamAndStudent(examPaperId, studentId);

        boolean isNew = false;

        if (submission == null) {
            // Create new submission
            submission = new RDExamSubmission();
            submission.setExamPaperId(examPaperId);
            submission.setStudentId(studentId);
            submission.setAttemptNo(1);
            submission.setStatus(RDExamSubmission.SubmissionStatus.DRAFT);
            submission.setSubmittedAt(LocalDateTime.now());

            submissionDAO.save(submission); // submissionId generated
            isNew = true;
        } else {
            // Re-upload → clear previous files
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

            submission.setSubmittedAt(LocalDateTime.now());
        }

        // 2️⃣ Create directory (same submissionId)
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

        // 3️⃣ Save new files
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

        // 4️⃣ Finalize submission
        submission.setFilePaths(savedFilePaths);
        submission.setStatus(RDExamSubmission.SubmissionStatus.SUBMITTED);

        if (isNew) {
            submissionDAO.update(submission);
        } else {
            submissionDAO.update(submission);
        }

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
        return submissionDAO
                .findLatestByExamAndStudent(examPaperId, studentId);
    }

    /* =====================================================
       GET BY ID
       ===================================================== */
    @Override
    @Transactional(readOnly = true)
    public RDExamSubmission getSubmissionById(Integer submissionId) {
        return submissionDAO.findById(submissionId);
    }

    /* =====================================================
       MAP: examPaperId → latest submission (SESSION VIEW)
       ===================================================== */
    @Override
    @Transactional(readOnly = true)
    public Map<Integer, RDExamSubmission>
    getStudentSubmissionsForSession(Integer studentId, Integer sessionId) {

        List<RDExamSubmission> submissions =
                submissionDAO.findByStudentAndSession(studentId, sessionId);

        Map<Integer, RDExamSubmission> submissionMap = new HashMap<>();

        // Keep latest submission per exam paper
        for (RDExamSubmission submission : submissions) {
            Integer examPaperId = submission.getExamPaperId();
            if (!submissionMap.containsKey(examPaperId)) {
                submissionMap.put(examPaperId, submission);
            }
        }

        return submissionMap;
    }

	@Override
    @Transactional(readOnly = true)
    public RDExamSubmission getByIdWithFiles(Integer submissionId) {
        return submissionDAO.findByIdWithFiles(submissionId);
    }



	@Override
    public void markEvaluating(Integer submissionId) {

        RDExamSubmission submission =
                submissionDAO.findById(submissionId);

        if (submission == null) {
            throw new IllegalArgumentException(
                "Submission not found: " + submissionId
            );
        }

        submission.setStatus(
            RDExamSubmission.SubmissionStatus.EVALUATING
        );

        submissionDAO.update(submission);
    }

    /* =====================================================
       MARK AS AI EVALUATED
       ===================================================== */
    @Override
    public void markEvaluated(Integer submissionId) {

        RDExamSubmission submission =
                submissionDAO.findById(submissionId);

        if (submission == null) {
            throw new IllegalArgumentException(
                "Submission not found: " + submissionId
            );
        }

        submission.setStatus(
            RDExamSubmission.SubmissionStatus.AI_EVALUATED
        );

        submissionDAO.update(submission);
    }
}
