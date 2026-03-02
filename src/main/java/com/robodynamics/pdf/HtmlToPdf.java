package com.robodynamics.pdf;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import java.io.ByteArrayOutputStream;

public class HtmlToPdf {

    /** Default output: portrait. */
    public static byte[] toPdf(String html, String baseUri) {
        return toPdf(html, baseUri, false, true);
    }

    /**
     * Backward-compatible overload used by controllers:
     * true = landscape, false = portrait.
     */
    public static byte[] toPdf(String html, String baseUri, boolean landscape) {
        return toPdf(html, baseUri, landscape, true);
    }

    /**
     * Full control overload.
     * @param landscape true for landscape page layout.
     * @param fastMode true to try HTML5 parser first, else strict XML mode.
     */
    public static byte[] toPdf(String html, String baseUri, boolean landscape, boolean fastMode) {
        if (html == null) html = "";
        if (fastMode) {
            try {
                return renderFast(html, baseUri, landscape);
            } catch (Throwable t) {
                // Fallback for cases like &nbsp; in strict parser path
                return renderXmlSanitized(html, baseUri, landscape);
            }
        } else {
            return renderXmlSanitized(html, baseUri, landscape);
        }
    }

    /** Explicit helper if you ever want to force XML mode. */
    public static byte[] toPdfXmlCompat(String html, String baseUri) {
        return renderXmlSanitized(html, baseUri, false);
    }

    // --- Internals ---

    private static byte[] renderFast(String html, String baseUri, boolean landscape) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode(); // HTML5 tolerant parser
            applyPageSize(builder, landscape);
            builder.withHtmlContent(html, baseUri);
            builder.toStream(baos);
            builder.run();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("HTML to PDF (fast) failed", e);
        }
    }

    private static byte[] renderXmlSanitized(String html, String baseUri, boolean landscape) {
        String safe = sanitizeForXml(html);
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            applyPageSize(builder, landscape);
            builder.withHtmlContent(safe, baseUri); // strict XML/XHTML parser
            builder.toStream(baos);
            builder.run();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("HTML to PDF (XML fallback) failed", e);
        }
    }

    private static void applyPageSize(PdfRendererBuilder builder, boolean landscape) {
        if (landscape) {
            builder.useDefaultPageSize(11f, 8.5f, PdfRendererBuilder.PageSizeUnits.INCHES);
        } else {
            builder.useDefaultPageSize(8.5f, 11f, PdfRendererBuilder.PageSizeUnits.INCHES);
        }
    }

    /** Replace common HTML named entities with numeric references that XML accepts. */
    private static String sanitizeForXml(String html) {
        // Strip script blocks for PDF rendering; interactive JS is not needed in static output.
        String out = html
            .replaceAll("(?is)<script\\b[^>]*>.*?</script>", "")
            // Escape raw ampersands that are not already entities.
            .replaceAll("&(?!(?:#\\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);)", "&amp;")
            // Convert HTML void tags into XHTML-compatible self-closing tags.
            .replaceAll("(?i)<(meta|link|img|br|hr|input)([^>]*?)(?<!/)>", "<$1$2/>")
            // Be generous: handle case-insensitive &nbsp; and missing ';'
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
        // Any remaining named entities would break strict XML; keep literal text instead.
        out = out.replaceAll("&(?!(?:amp|lt|gt|quot|apos|#\\d+|#x[0-9a-fA-F]+);)([a-zA-Z][a-zA-Z0-9]+);", "&amp;$1;");
        return out;
    }
}
