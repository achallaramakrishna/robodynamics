package com.robodynamics.service.impl;

import com.robodynamics.model.RDExamSubmission;
import com.robodynamics.service.RDExamAnswerExtractionService;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;
import java.util.List;

@Service
public class RDExamAnswerExtractionServiceImpl
        implements RDExamAnswerExtractionService {

    @Override
    public String extractAnswerText(RDExamSubmission submission) {

        if (submission == null || submission.getFilePaths() == null) {
            return "";
        }

        StringBuilder combinedText = new StringBuilder();

        List<String> paths = submission.getFilePaths();

        for (String filePath : paths) {
            try {
                Path path = Path.of(filePath);
                String lower = path.getFileName().toString().toLowerCase();

                if (lower.endsWith(".pdf")) {
                    combinedText.append(
                        extractFromPdf(path.toFile())
                    ).append("\n\n");
                } else if (isImage(lower)) {
                    combinedText.append(
                        "[IMAGE FILE SKIPPED: OCR PENDING]\n"
                    );
                } else {
                    combinedText.append(
                        "[UNSUPPORTED FILE TYPE]\n"
                    );
                }

            } catch (Exception e) {
                combinedText.append(
                    "[ERROR READING FILE: ").append(filePath).append("]\n"
                );
            }
        }

        return normalizeText(combinedText.toString());
    }

    /* ================= PDF ================= */

    private String extractFromPdf(File pdfFile) throws Exception {
        try (PDDocument document = Loader.loadPDF(pdfFile)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            return stripper.getText(document);
        }
    }

    /* ================= HELPERS ================= */

    private boolean isImage(String name) {
        return name.endsWith(".jpg")
            || name.endsWith(".jpeg")
            || name.endsWith(".png")
            || name.endsWith(".webp");
    }

    private String normalizeText(String text) {
        return text
                .replaceAll("\\r", "")
                .replaceAll("[ \\t]+", " ")
                .replaceAll("\\n{3,}", "\n\n")
                .trim();
    }
}
