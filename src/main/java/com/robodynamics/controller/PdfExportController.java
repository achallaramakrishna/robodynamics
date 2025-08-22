package com.robodynamics.controller;

import com.robodynamics.pdf.JspCapture;
import com.robodynamics.pdf.HtmlToPdf;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Generic JSP-to-PDF exporter.
 *
 * Usage:
 *   GET /export/pdf-page?path=/attendance-tracking-flat&landscape=true&filename=attendance.pdf&asPdf=1&range=day&date=2025-08-23 ...
 *
 * Notes:
 * - "path" MUST be an internal MVC path (same app). We validate/whitelist.
 * - All request params are forwarded to the target path, + you can add/override via query itself.
 * - In your JSP, check ${param.asPdf} to hide nav/buttons.
 */
@Controller
@RequestMapping("/export")
public class PdfExportController {

    // Whitelist to avoid exporting arbitrary internal admin/debug pages.
    private static final Set<String> ALLOWED_PATHS = new HashSet<>(Arrays.asList(
        "/attendance-tracking-flat",
        "/attendance-tracking" // add more view paths as you need
    ));

    @GetMapping("/pdf-page")
    public ResponseEntity<byte[]> exportPageToPdf(@RequestParam("path") String path,
                                                  @RequestParam(value = "filename", required = false) String filename,
                                                  @RequestParam(value = "landscape", defaultValue = "true") boolean landscape,
                                                  HttpServletRequest req,
                                                  HttpServletResponse resp) {

        // 1) Validate target path
        if (path == null || !ALLOWED_PATHS.contains(path)) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.TEXT_PLAIN)
                    .body(("Unsupported export path: " + path).getBytes(StandardCharsets.UTF_8));
        }

        // 2) Merge current request parameters and force asPdf=1
        Map<String, String[]> merged = new HashMap<>(req.getParameterMap());
        merged.put("asPdf", new String[] { "1" });

        // 3) Render the target path (controller + JSP) into HTML string
        String html = JspCapture.renderToHtml(req, resp, path, merged);

        // 4) Base URL so relative resources resolve in PDF (logos, CSS)
        String baseUrl = req.getScheme() + "://" + req.getServerName() +
                         (req.getServerPort() == 80 || req.getServerPort() == 443 ? "" : ":" + req.getServerPort()) +
                         req.getContextPath() + "/";

        // 5) Convert HTML → PDF
        byte[] pdf = HtmlToPdf.toPdf(html, baseUrl, landscape);

        // 6) Download response
        String name = (filename == null || filename.isBlank()) ? "export.pdf" : filename;
        String cd = "attachment; filename=\"" + URLEncoder.encode(name, StandardCharsets.UTF_8).replace("+", "%20") + "\"";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, cd)
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdf.length)
                .body(pdf);
    }
}
