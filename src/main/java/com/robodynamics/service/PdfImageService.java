package com.robodynamics.service;

import javax.imageio.ImageIO;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@Component
public class PdfImageService {

    public List<File> convertPdfToImages(Path pdfPath) throws Exception {

        List<File> images = new ArrayList<>();
        Path tempDir = Files.createTempDirectory("ocr_pages");

        try (PDDocument document = Loader.loadPDF(pdfPath.toFile())) {
            PDFRenderer renderer = new PDFRenderer(document);

            for (int i = 0; i < document.getNumberOfPages(); i++) {
                BufferedImage image = renderer.renderImageWithDPI(i, 300);
                File out = tempDir.resolve("page_" + (i + 1) + ".png").toFile();
                ImageIO.write(image, "PNG", out);
                images.add(out);
            }
        }

        return images;
    }
}
