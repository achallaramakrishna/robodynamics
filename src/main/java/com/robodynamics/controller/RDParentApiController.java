package com.robodynamics.controller;

import java.util.*;
import java.util.stream.Collectors;
import javax.servlet.http.HttpSession;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.robodynamics.dto.RDChapterItem; // existing
import com.robodynamics.dto.RDSessionItem; // NEW
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDTestService;

@RestController
@RequestMapping("/parent/api")
public class RDParentApiController {

    @Autowired
    private RDTestService testService;

    @GetMapping("/allowed-courses")
    public ResponseEntity<?> allowedCourses(HttpSession session) {
        RDUser u = (RDUser) session.getAttribute("rdUser");
        if (u == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not signed in");
        List<RDCourse> courses = testService.allowedCoursesForParent(u.getUserID());
        return ResponseEntity.ok(courses);
    }

    // ---------- NEW: sessions (chapters) endpoint ----------
    @GetMapping("/sessions")
    public ResponseEntity<?> sessions(@RequestParam("courseId") Integer courseId,
                                      @RequestParam(value = "offeringId", required = false) Integer offeringId,
                                      @RequestParam(value = "sessionType", required = false, defaultValue = "session") String sessionType,
                                      HttpSession session) {
        RDUser u = (RDUser) session.getAttribute("rdUser");
        if (u == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not signed in");

        // Guard: ensure the course is allowed for this parent
        Set<Integer> allowed = testService.allowedCoursesForParent(u.getUserID())
                .stream().map(RDCourse::getCourseId).collect(Collectors.toSet());
        if (courseId == null || !allowed.contains(courseId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Course not available");
        }

        // Ask service for Course Sessions (optionally filtered by offering and type)
        // Service should return lightweight projections/entities with the needed fields.
        List<?> rows = testService.findCourseSessionsForParent(u.getUserID(), courseId, offeringId, sessionType);
        System.out.println("Rows - " + rows.size());
        // Map defensively to DTOs (no lazy touches)
        List<RDSessionItem> dto = new ArrayList<>();
        for (Object r : rows) {
            if (r == null) continue;

            // Try common getters via reflection to avoid tying to entity type
            Integer id = tryGetInt(r, "getCourseSessionId", "getSessionId", "getId");
            if (id == null && r instanceof Map) {
                Object idObj = firstNonNull(((Map<?,?>) r).get("courseSessionId"),
                                            ((Map<?,?>) r).get("sessionId"),
                                            ((Map<?,?>) r).get("id"));
                id = asInt(idObj);
            }

            String title = tryGetStr(r, "getSessionTitle", "getTopic", "getName");
            System.out.println("Session Title - " + title);
            Integer seq  = tryGetInt(r, "getSequenceNo", "getSeq", "getOrder");
            String type  = tryGetStr(r, "getSessionType");
            if (type == null && r instanceof Map) {
                type = str(((Map<?,?>) r).get("sessionType"));
            }

            if (id != null) {
                dto.add(new RDSessionItem(
                    id,
                    title != null ? title : ("Session #" + id),
                    seq,
                    type != null ? type : sessionType // fallback to requested filter
                ));
            }
        }

        return ResponseEntity.ok(dto);
    }
    // -------------------------------------------------------

    // Back-compat: keep /chapters working by delegating to /sessions with type=CHAPTER
    @GetMapping("/chapters")
    public ResponseEntity<?> chapters(@RequestParam("courseId") Integer courseId,
                                      @RequestParam(value = "offeringId", required = false) Integer offeringId,
                                      HttpSession session) {
        return sessions(courseId, offeringId, "session", session);
    }

    // ---- helpers ----
    private static Object firstNonNull(Object... xs){
        for (Object x: xs) if (x != null) return x;
        return null;
    }
    private static String str(Object x){ return x==null? null : String.valueOf(x); }
    private static Integer asInt(Object x){
        if (x == null) return null;
        if (x instanceof Number) return ((Number)x).intValue();
        try { return Integer.valueOf(String.valueOf(x)); } catch (Exception e) { return null; }
    }
    private static Integer tryGetInt(Object bean, String... methods){
        for (String m : methods) {
            try { Object v = bean.getClass().getMethod(m).invoke(bean);
                  Integer i = asInt(v); if (i != null) return i;
            } catch (Exception ignore) {}
        }
        return null;
    }
    private static String tryGetStr(Object bean, String... methods){
        for (String m : methods) {
            try { Object v = bean.getClass().getMethod(m).invoke(bean);
                  if (v != null) return String.valueOf(v);
            } catch (Exception ignore) {}
        }
        return null;
    }
}
