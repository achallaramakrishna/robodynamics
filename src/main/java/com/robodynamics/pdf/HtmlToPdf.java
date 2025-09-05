// com.robodynamics.pdf.HtmlToPdf
package com.robodynamics.pdf;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import com.openhtmltopdf.util.XRRuntimeException;

import java.io.ByteArrayOutputStream;

public class HtmlToPdf {

    /** Default: try Fast HTML5 first, then fallback to sanitized XML mode if needed. */
    public static byte[] toPdf(String html, String baseUri) {
        return toPdf(html, baseUri, true);
    }

    /**
     * @param fastMode true → try HTML5 (JSoup) first, else go straight to XML mode with sanitization.
     */
    public static byte[] toPdf(String html, String baseUri, boolean fastMode) {
        if (html == null) html = "";
        if (fastMode) {
            try {
                return renderFast(html, baseUri);
            } catch (Throwable t) {
                // Fallback for cases like &nbsp; in strict parser path
                return renderXmlSanitized(html, baseUri);
            }
        } else {
            return renderXmlSanitized(html, baseUri);
        }
    }

    /** Explicit helper if you ever want to force XML mode. */
    public static byte[] toPdfXmlCompat(String html, String baseUri) {
        return renderXmlSanitized(html, baseUri);
    }

    // --- Internals ---

    private static byte[] renderFast(String html, String baseUri) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfRendererBuilder b = new PdfRendererBuilder();
            b.useFastMode();                  // HTML5 tolerant parser
            b.withHtmlContent(html, baseUri);
            b.toStream(baos);
            b.run();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("HTML→PDF (fast) failed", e);
        }
    }

    private static byte[] renderXmlSanitized(String html, String baseUri) {
        String safe = sanitizeForXml(html);
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfRendererBuilder b = new PdfRendererBuilder();
            b.withHtmlContent(safe, baseUri); // strict XML/XHTML parser
            b.toStream(baos);
            b.run();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("HTML→PDF (XML fallback) failed", e);
        }
    }

    /** Replace common HTML named entities with numeric references that XML accepts. */
    private static String sanitizeForXml(String html) {
        // Be generous: handle case-insensitive &nbsp; and missing ';'
        String out = html
            .replaceAll("(?i)&nbsp;?", "&#160;")
            .replace("&ensp;",   "&#8194;")
            .replace("&emsp;",   "&#8195;")
            .replace("&thinsp;", "&#8201;")
            .replace("&hellip;", "&#8230;")
            .replace("&copy;",   "&#169;")
            .replace("&reg;",    "&#174;")
            .replace("&trade;",  "&#8482;")
            .replace("&laquo;",  "&#171;")
            .replace("&raquo;",  "&#187;")
            .replace("&lsquo;",  "&#8216;")
            .replace("&rsquo;",  "&#8217;")
            .replace("&ldquo;",  "&#8220;")
            .replace("&rdquo;",  "&#8221;")
            .replace("&mdash;",  "&#8212;")
            .replace("&ndash;",  "&#8211;")
            // Core XML entities (safe either way)
            .replace("&apos;",   "&#39;")
            .replace("&quot;",   "&#34;")
            .replace("&lt;",     "&#60;")
            .replace("&gt;",     "&#62;");
        return out;
    }
}
