package com.robodynamics.util;


import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;

public class PdfToImageUtil {

    // 🔹 Backward-compatible method (defaults to 300 DPI)
    public static void convertPdfToImages(
            String pdfPath,
            String outputDir
    ) throws Exception {

        convertPdfToImages(pdfPath, outputDir, 300);
    }

    // 🔹 Recommended method (DPI configurable)
    public static void convertPdfToImages(
            String pdfPath,
            String outputDir,
            int dpi
    ) throws Exception {

        try (PDDocument document = PDDocument.load(new File(pdfPath))) {

            PDFRenderer renderer = new PDFRenderer(document);

            for (int page = 0; page < document.getNumberOfPages(); page++) {

                BufferedImage image =
                        renderer.renderImageWithDPI(page, dpi);

                File outputFile =
                        new File(outputDir, "page_" + (page + 1) + ".png");

                ImageIO.write(image, "PNG", outputFile);
            }
        }
    }
}
