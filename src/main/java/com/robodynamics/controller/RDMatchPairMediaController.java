package com.robodynamics.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.model.*;
import com.robodynamics.service.*;

@Controller
@RequestMapping("/matchpairs/media")
public class RDMatchPairMediaController {

    /* ================= SERVICES ================= */

    @Autowired private RDCourseService courseService;
    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDCourseSessionDetailService courseSessionDetailService;
    @Autowired private RDMatchQuestionService matchQuestionService;
    @Autowired private RDMatchPairService matchPairService;

    /* ================= FILE STORAGE ================= */

    @Value("${rd.session.materials.base:/opt/robodynamics/session_materials}")
    private String materialsBase;

    private Path matchPairFolder(int courseId) {
        return Paths.get(materialsBase, String.valueOf(courseId), "matchpairs");
    }

    /** Build public URL from filename (DB stores only file name) */
    private String publicUrl(int courseId, String fileName) {
        if (fileName == null || fileName.isBlank()) return null;
        return "/session_materials/" + courseId + "/matchpairs/" + fileName;
    }

    /* ================= PAGE ================= */

    @GetMapping("/manage")
    public String showMatchPairMediaPage(Model model) {
        model.addAttribute("courses", courseService.getRDCourses());
        return "matchpairs/matchpairMediaManager";
    }

    /* =================================================
     * CASCADING FILTER APIs (USED BY JSP)
     * ================================================= */

    /** Sessions by course */
    @GetMapping("/sessions")
    @ResponseBody
    public List<Map<String, Object>> getSessions(@RequestParam int courseId) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (RDCourseSession s : courseSessionService.getCourseSessionsByCourseId(courseId)) {
            Map<String, Object> m = new HashMap<>();
            m.put("sessionId", s.getCourseSessionId());
            m.put("sessionTitle", s.getSessionTitle());
            list.add(m);
        }
        return list;
    }

    /** Session details by session */
    @GetMapping("/session-details")
    @ResponseBody
    public List<Map<String, Object>> getSessionDetails(@RequestParam int sessionId) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (RDCourseSessionDetail d : courseSessionDetailService.findSessionDetailsBySessionId(sessionId)) {
            Map<String, Object> m = new HashMap<>();
            m.put("sessionDetailId", d.getCourseSessionDetailId());
            m.put("topic", d.getTopic());
            list.add(m);
        }
        return list;
    }

    /**
     * ONE match question per session detail.
     * Return empty object if not found (frontend checks empty).
     */
    @GetMapping("/match-question")
    @ResponseBody
    public Map<String, Object> getMatchQuestionBySessionDetail(@RequestParam int courseSessionDetailId) {

        RDMatchQuestion q = matchQuestionService.findBySessionDetail(courseSessionDetailId);
        if (q == null) return Collections.emptyMap();

        Map<String, Object> m = new HashMap<>();
        m.put("matchQuestionId", q.getMatchQuestionId());
        m.put("instructions", q.getInstructions());
        m.put("difficultyLevel", q.getDifficultyLevel());
        m.put("totalPairs", q.getTotalPairs());
        m.put("active", q.getActive());
        return m;
    }

    /* =================================================
     * MATCH PAIRS APIs (USED BY JSP)
     * ================================================= */

    /** List pairs by match question */
    @GetMapping("/pairs")
    @ResponseBody
    public List<Map<String, Object>> listPairs(@RequestParam int matchQuestionId) {

        List<RDMatchPair> pairs = matchPairService.getPairsByQuestionId(matchQuestionId);

        List<Map<String, Object>> list = new ArrayList<>();
        for (RDMatchPair p : pairs) {
            Map<String, Object> m = new HashMap<>();
            m.put("matchPairId", p.getMatchPairId());
            m.put("leftText", p.getLeftText());
            m.put("rightText", p.getRightText());
            m.put("hasLeftImage", p.getLeftImage() != null);
            m.put("hasRightImage", p.getRightImage() != null);
            list.add(m);
        }
        return list;
    }

    /** Fetch single pair for upload modal (includes preview URLs) */
    @GetMapping("/pair")
    @ResponseBody
    public Map<String, Object> getPair(@RequestParam int matchPairId) {

        RDMatchPair pair = matchPairService.getMatchPair(matchPairId);
        if (pair == null) return Collections.emptyMap();

        int courseId = matchPairService.getCourseIdForPair(matchPairId);

        Map<String, Object> m = new HashMap<>();
        m.put("matchPairId", pair.getMatchPairId());
        m.put("leftText", pair.getLeftText());
        m.put("rightText", pair.getRightText());

        // DB stores only file name
        m.put("leftImageName", pair.getLeftImage());
        m.put("rightImageName", pair.getRightImage());

        // For preview in UI
        m.put("leftImageUrl", publicUrl(courseId, pair.getLeftImage()));
        m.put("rightImageUrl", publicUrl(courseId, pair.getRightImage()));

        return m;
    }

    /* =================================================
     * IMAGE UPLOAD (DB STORES ONLY FILE NAME)
     * ================================================= */

    @Transactional
    @PostMapping(
        value = "/upload",
        consumes = "multipart/form-data",
        produces = "application/json"
    )
    @ResponseBody
    public Map<String, Object> uploadImages(
            @RequestParam int matchPairId,
            @RequestParam(required = false) MultipartFile leftImage,
            @RequestParam(required = false) MultipartFile rightImage,
            @RequestParam(defaultValue = "0") int leftRemove,
            @RequestParam(defaultValue = "0") int rightRemove) {

        try {
            RDMatchPair pair = matchPairService.getMatchPair(matchPairId);
            if (pair == null) {
                return Map.of("ok", false, "message", "Match pair not found");
            }

            int courseId =
                pair.getMatchQuestion()
                    .getCourseSessionDetail()
                    .getCourse()
                    .getCourseId();

            Path folder = matchPairFolder(courseId);
            Files.createDirectories(folder);

            // remove flags
            if (leftRemove == 1) pair.setLeftImage(null);
            if (rightRemove == 1) pair.setRightImage(null);

            // left upload
            if (leftImage != null && !leftImage.isEmpty()) {
                String fileName =
                        "mp_" + matchPairId + "_l_" +
                        StringUtils.cleanPath(leftImage.getOriginalFilename());

                leftImage.transferTo(folder.resolve(fileName));
                pair.setLeftImage(fileName); // ✅ filename only
            }

            // right upload
            if (rightImage != null && !rightImage.isEmpty()) {
                String fileName =
                        "mp_" + matchPairId + "_r_" +
                        StringUtils.cleanPath(rightImage.getOriginalFilename());

                rightImage.transferTo(folder.resolve(fileName));
                pair.setRightImage(fileName); // ✅ filename only
            }

            matchPairService.saveMatchPair(pair);

            return Map.of(
                "ok", true,
                "leftImageName", pair.getLeftImage(),
                "rightImageName", pair.getRightImage()
            );

        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("ok", false, "message", e.getMessage());
        }
    }
}
