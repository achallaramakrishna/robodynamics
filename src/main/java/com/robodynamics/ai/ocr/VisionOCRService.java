package com.robodynamics.ai.ocr;

import com.robodynamics.util.PdfToImageUtil;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.Comparator;

@Service
public class VisionOCRService {

    @Autowired
    private OpenAIVisionOCR openAIVisionOCR;

    public String extractText(Path path) {

        String file = path.toString().toLowerCase();

        try {
            if (file.endsWith(".pdf")) {
                return extractFromPdf(path);
            }
            else if (file.endsWith(".png")
                  || file.endsWith(".jpg")
                  || file.endsWith(".jpeg")) {

                return openAIVisionOCR.extractTextFromImage(path.toFile());
            }
            else if (file.endsWith(".txt")) {
                return Files.readString(path);
            }

        } catch (Exception e) {
            return "[OCR FAILED: " + path.getFileName() + "]";
        }

        return "";
    }

    private String extractFromPdf(Path pdfPath) throws Exception {

        // 1️⃣ Try native PDF text first
        try (PDDocument doc = Loader.loadPDF(pdfPath.toFile())) {

            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(doc);

            if (text != null && text.trim().length() > 50) {
                return text;
            }
        }

        // 2️⃣ Scanned PDF → Vision OCR
        Path tempDir = Files.createTempDirectory("ocr_pdf_");

        try {
            PdfToImageUtil.convertPdfToImages(
                    pdfPath.toString(),
                    tempDir.toString(),
                    220   // 👈 ideal DPI for Vision OCR
            );

            File[] images = tempDir.toFile().listFiles();

            if (images == null) return "";

            // Ensure page order
            Arrays.sort(images, Comparator.comparing(File::getName));

            StringBuilder sb = new StringBuilder();

            for (File img : images) {
                sb.append(
                    openAIVisionOCR.extractTextFromImage(img)
                ).append("\n\n");
            }

            return sb.toString();

        } finally {
            // 🧹 Cleanup temp files
            deleteDirectory(tempDir.toFile());
        }
    }

    private void deleteDirectory(File dir) {
        if (dir == null || !dir.exists()) return;

        for (File f : dir.listFiles()) {
            if (f.isDirectory()) deleteDirectory(f);
            else f.delete();
        }
        dir.delete();
    }
}
