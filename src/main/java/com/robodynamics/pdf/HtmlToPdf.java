package com.robodynamics.pdf;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

public final class HtmlToPdf {
  public static byte[] toPdf(String html, String baseUrl, boolean landscape) {
    try (var baos = new java.io.ByteArrayOutputStream()) {
      PdfRendererBuilder b = new PdfRendererBuilder();
      b.useFastMode();
      b.withHtmlContent(html, baseUrl);
      // A4: 210 × 297 mm — swap for landscape
      if (landscape) {
        b.useDefaultPageSize(297, 210, PdfRendererBuilder.PageSizeUnits.MM);
      } else {
        b.useDefaultPageSize(210, 297, PdfRendererBuilder.PageSizeUnits.MM);
      }
      b.toStream(baos);
      b.run();
      return baos.toByteArray();
    } catch (Exception e) {
      throw new RuntimeException("HTML→PDF failed", e);
    }
  }
}
