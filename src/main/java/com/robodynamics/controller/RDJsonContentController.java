package com.robodynamics.controller;

import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serves JSON-file-based course content (flashcard, quiz, matchinggame,
 * matchingpair, exampaper, notes, labmanual) stored in rd_course_session_details.file.
 *
 * Also provides a list-picker when a session has multiple assets of the same type.
 */
@Controller
@RequestMapping("/student/content")
public class RDJsonContentController {

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Value("${rd.session.materials.base:/opt/robodynamics/session_materials}")
    private String sessionMaterialsBase;

    /** View a single JSON-backed asset. */
    @GetMapping("/{detailId}")
    public String viewContent(@PathVariable int detailId,
                              @RequestParam(required = false) Integer enrollmentId,
                              Model model) {

        RDCourseSessionDetail detail =
                courseSessionDetailService.getRDCourseSessionDetail(detailId);

        if (detail == null || detail.getFile() == null || detail.getFile().isEmpty()) {
            model.addAttribute("error", "Content not found.");
            return "student/json-content-viewer";
        }

        try {
            String fileRef = detail.getFile().trim();

            // PDF/notes assets should open directly via static session_materials URL.
            if (isPdfAsset(detail, fileRef)) {
                return "redirect:" + toPublicPdfUrl(detail, fileRef);
            }

            Path contentPath = resolveContentPath(detail, fileRef);
            if (contentPath == null || !Files.exists(contentPath)) {
                throw new IllegalStateException("Content file not found: " + fileRef);
            }

            String json = new String(
                    Files.readAllBytes(contentPath),
                    StandardCharsets.UTF_8);

            // Escape </script> to prevent early script-tag closure
            json = json.replace("</script>", "<\\/script>");

            model.addAttribute("contentJson",  json);
            model.addAttribute("contentType",  detail.getType());
            model.addAttribute("contentTitle", detail.getTopic());
            model.addAttribute("detailId",     detailId);
            model.addAttribute("enrollmentId", enrollmentId);

            if (detail.getCourseSession() != null) {
                model.addAttribute("courseSessionId",
                        detail.getCourseSession().getCourseSessionId());
                if (detail.getCourseSession().getCourse() != null) {
                    model.addAttribute("courseId",
                            detail.getCourseSession().getCourse().getCourseId());
                }
            }
        } catch (Exception e) {
            model.addAttribute("error", "Cannot load content: " + e.getMessage());
        }

        return "student/json-content-viewer";
    }

    private boolean isPdfAsset(RDCourseSessionDetail detail, String fileRef) {
        String type = detail.getType() == null ? "" : detail.getType().trim().toLowerCase();
        String normalized = fileRef == null ? "" : fileRef.trim().toLowerCase();
        return "pdf".equals(type) || normalized.endsWith(".pdf");
    }

    private String toPublicPdfUrl(RDCourseSessionDetail detail, String fileRef) {
        String normalized = fileRef == null ? "" : fileRef.trim().replace('\\', '/');
        if (normalized.startsWith("/session_materials/")) {
            return normalized;
        }
        if (normalized.startsWith("session_materials/")) {
            return "/" + normalized;
        }
        if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
            return normalized;
        }

        Integer courseId = null;
        if (detail.getCourseSession() != null && detail.getCourseSession().getCourse() != null) {
            courseId = detail.getCourseSession().getCourse().getCourseId();
        } else if (detail.getCourse() != null) {
            courseId = detail.getCourse().getCourseId();
        }
        if (courseId != null && courseId > 0) {
            String fileName = Paths.get(normalized).getFileName().toString();
            return "/session_materials/" + courseId + "/" + fileName;
        }
        return normalized.startsWith("/") ? normalized : "/" + normalized;
    }

    private Path resolveContentPath(RDCourseSessionDetail detail, String fileRef) {
        if (fileRef == null || fileRef.trim().isEmpty()) {
            return null;
        }
        String normalized = fileRef.trim().replace('\\', '/');

        if (normalized.startsWith("/session_materials/")) {
            String rel = normalized.substring("/session_materials/".length());
            return Paths.get(sessionMaterialsBase).resolve(rel).normalize();
        }

        Path rawPath = Paths.get(fileRef);
        if (rawPath.isAbsolute()) {
            return rawPath.normalize();
        }

        Integer courseId = null;
        if (detail.getCourseSession() != null && detail.getCourseSession().getCourse() != null) {
            courseId = detail.getCourseSession().getCourse().getCourseId();
        } else if (detail.getCourse() != null) {
            courseId = detail.getCourse().getCourseId();
        }
        if (courseId != null && courseId > 0) {
            Path candidate = Paths.get(sessionMaterialsBase, String.valueOf(courseId), normalized).normalize();
            if (Files.exists(candidate)) {
                return candidate;
            }
        }
        return rawPath.normalize();
    }

    /**
     * List all JSON-backed assets of a given type for a session.
     * Used when there are multiple notes, quizzes, flashcards, etc.
     */
    @GetMapping("/list/{sessionId}/{type}")
    public String listContent(@PathVariable int sessionId,
                              @PathVariable String type,
                              @RequestParam(required = false) Integer enrollmentId,
                              Model model) {

        // normalise: "notes" and "pdf" are the same bucket
        List<RDCourseSessionDetail> details;
        if ("notes".equals(type) || "pdf".equals(type)) {
            details = courseSessionDetailService.getBySessionAndType(sessionId, "notes");
            details.addAll(courseSessionDetailService.getBySessionAndType(sessionId, "pdf"));
        } else {
            details = courseSessionDetailService.getBySessionAndType(sessionId, type);
        }

        // Keep only file-backed entries
        List<RDCourseSessionDetail> items = details.stream()
                .filter(d -> d.getFile() != null && !d.getFile().trim().isEmpty())
                .collect(Collectors.toList());

        // If exactly one, jump straight to the viewer
        if (items.size() == 1) {
            return "redirect:/student/content/" + items.get(0).getCourseSessionDetailId()
                    + (enrollmentId != null ? "?enrollmentId=" + enrollmentId : "");
        }

        RDCourseSession session = courseSessionService.getCourseSession(sessionId);
        model.addAttribute("sessionObj",   session);
        model.addAttribute("items",        items);
        model.addAttribute("contentType",  type);
        model.addAttribute("sessionId",    sessionId);
        model.addAttribute("enrollmentId", enrollmentId);

        if (session != null && session.getCourse() != null) {
            model.addAttribute("courseId", session.getCourse().getCourseId());
        }

        return "student/content-list";
    }
}
