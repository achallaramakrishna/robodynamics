package com.robodynamics.controller;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.robodynamics.model.*;
import com.robodynamics.service.*;
import com.robodynamics.wrapper.RDMatchPairJson;
import com.robodynamics.wrapper.RDMatchQuestionJson;

@Controller
@RequestMapping("/matchpairs")
public class RDMatchQuestionController {

    /* =========================================================
     * SERVICES
     * ========================================================= */

    @Autowired private RDCourseCategoryService courseCategoryService;
    @Autowired private RDCourseService rdCourseService;
    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDCourseSessionDetailService courseSessionDetailService;
    @Autowired private RDMatchQuestionService matchQuestionService;
    @Autowired private RDMatchPairService matchPairService;

    /* =========================================================
     * ADMIN – LIST PAGE
     * ========================================================= */

    @GetMapping("/list")
    public String list(Model model) {
        model.addAttribute("categories",
                courseCategoryService.getRDCourseCategories());
        return "matchpairs/listMatchQuestions";
    }

    /* =========================================================
     * CASCADE APIs
     * ========================================================= */

    @GetMapping("/getCoursesByCategory")
    @ResponseBody
    public Map<String, Object> getCoursesByCategory(
            @RequestParam int categoryId) {

        List<Map<String, Object>> courses =
            rdCourseService.getCoursesByCategoryId(categoryId)
                .stream()
                .map(c -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("courseId", c.getCourseId());
                    m.put("courseName", c.getCourseName());
                    return m;
                })
                .collect(Collectors.toList());

        return Map.of("courses", courses);
    }

    @GetMapping("/getCourseSessions")
    @ResponseBody
    public Map<String, Object> getCourseSessions(
            @RequestParam int courseId) {

        return Map.of(
            "courseSessions",
            courseSessionService.getCourseSessionsByCourseId(courseId)
        );
    }

    @GetMapping("/getCourseSessionDetails")
    @ResponseBody
    public Map<String, Object> getCourseSessionDetails(
            @RequestParam int courseSessionId) {

        List<Map<String, Object>> details =
            courseSessionDetailService
                .findSessionDetailsBySessionId(courseSessionId)
                .stream()
                .map(d -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("courseSessionDetailId", d.getCourseSessionDetailId());
                    m.put("topic", d.getTopic());
                    return m;
                })
                .collect(Collectors.toList());

        return Map.of("sessionDetails", details);
    }

    /* =========================================================
     * FETCH MATCH QUESTION + PAIRS (CRITICAL)
     * ========================================================= */

    @GetMapping("/getBySessionDetail")
    @ResponseBody
    public Map<String, Object> getBySessionDetail(
            @RequestParam int courseSessionDetailId) {

        Map<String, Object> response = new HashMap<>();

        RDMatchQuestion question =
            matchQuestionService.findBySessionDetail(courseSessionDetailId);

        if (question == null) {
            response.put("matchQuestion", null);
            response.put("pairs", List.of());
            return response;
        }

        response.put("matchQuestion", Map.of(
            "matchQuestionId", question.getMatchQuestionId(),
            "instructions", question.getInstructions(),
            "difficultyLevel", question.getDifficultyLevel(),
            "totalPairs", question.getTotalPairs()
        ));

        List<Map<String, Object>> pairs =
            matchPairService
                .getPairsByQuestionId(question.getMatchQuestionId())
                .stream()
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("pairId", p.getMatchPairId());
                    m.put("leftText", p.getLeftText());
                    m.put("rightText", p.getRightText());
                    m.put("imageUrl",
                        p.getLeftImage() != null ? p.getLeftImage() : p.getRightImage()
                    );
                    return m;
                })
                .collect(Collectors.toList());

        response.put("pairs", pairs);
        return response;
    }

    /* =========================================================
     * CREATE / EDIT MATCH QUESTION
     * ========================================================= */

    @GetMapping("/create")
    public String createForm(
            @RequestParam(required = false) Integer courseSessionDetailId,
            Model model) {

        RDMatchQuestion q = new RDMatchQuestion();
        if (courseSessionDetailId != null) {
            q.setCourseSessionDetail(
                courseSessionDetailService
                    .getRDCourseSessionDetail(courseSessionDetailId)
            );
        }

        model.addAttribute("matchQuestion", q);
        model.addAttribute("pairs", List.of());
        return "matchpairs/matchQuestionForm";
    }

    @GetMapping("/edit/{id}")
    public String edit(@PathVariable int id, Model model) {

        model.addAttribute("matchQuestion",
                matchQuestionService.getMatchQuestion(id));

        model.addAttribute("pairs",
                matchPairService.getPairsByQuestionId(id));

        return "matchpairs/matchQuestionForm";
    }

    @PostMapping("/save")
    public String save(
            @ModelAttribute RDMatchQuestion question,
            RedirectAttributes ra) {

        matchQuestionService.save(question);

        ra.addFlashAttribute("success",
                "Match Question saved successfully");

        return "redirect:/matchpairs/edit/" +
                question.getMatchQuestionId();
    }

    /* =========================================================
     * DELETE MATCH QUESTION
     * ========================================================= */

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable int id, RedirectAttributes ra) {

        matchQuestionService.delete(id);
        ra.addFlashAttribute("success", "Match Question deleted");
        return "redirect:/matchpairs/list";
    }

    /* =========================================================
     * PAIRS CRUD
     * ========================================================= */

    @PostMapping("/pair/save")
    public String savePair(
            @ModelAttribute RDMatchPair pair,
            RedirectAttributes ra) {

        matchPairService.saveMatchPair(pair);

        int qId = pair.getMatchQuestion().getMatchQuestionId();
        matchQuestionService.updateTotalPairs(qId);

        ra.addFlashAttribute("success", "Match Pair saved");
        return "redirect:/matchpairs/edit/" + qId;
    }

    @GetMapping("/pair/delete/{pairId}")
    public String deletePair(
            @PathVariable int pairId,
            RedirectAttributes ra) {

        RDMatchPair pair = matchPairService.getMatchPair(pairId);
        int qId = pair.getMatchQuestion().getMatchQuestionId();

        matchPairService.deletePair(pairId);
        matchQuestionService.updateTotalPairs(qId);

        ra.addFlashAttribute("success", "Match Pair deleted");
        return "redirect:/matchpairs/edit/" + qId;
    }

    /* =========================================================
     * JSON BULK UPLOAD (FIXED)
     * ========================================================= */

    @PostMapping("/uploadJson")
    public String uploadMatchQuestionJson(
            @RequestParam("file") MultipartFile file,
            @RequestParam("courseSessionDetailId") int courseSessionDetailId,
            RedirectAttributes ra) {

        if (file.isEmpty()) {
            ra.addFlashAttribute("error", "Please select a JSON file");
            return "redirect:/matchpairs/list";
        }

        try (InputStream in = file.getInputStream()) {

            ObjectMapper mapper = new ObjectMapper();
            RDMatchQuestionJson json =
                    mapper.readValue(in, RDMatchQuestionJson.class);

            // Fetch session detail from dropdown value
            RDCourseSessionDetail sessionDetail =
                    courseSessionDetailService
                            .getRDCourseSessionDetail(courseSessionDetailId);

            if (sessionDetail == null) {
                ra.addFlashAttribute("error", "Invalid session detail selected");
                return "redirect:/matchpairs/list";
            }

            // ONE question per session detail
            RDMatchQuestion question =
                    matchQuestionService
                            .findBySessionDetail(courseSessionDetailId);

            if (question == null) {
                question = new RDMatchQuestion();
                question.setCourseSessionDetail(sessionDetail);
            }

            // Update question fields
            question.setInstructions(json.getInstructions());
            question.setDifficultyLevel(json.getDifficultyLevel());
            question.setActive(
                    json.getActive() != null ? json.getActive() : true
            );

            matchQuestionService.save(question);

            // Replace pairs
            matchPairService.deleteByQuestionId(
                    question.getMatchQuestionId());

            int order = 1;
            for (RDMatchPairJson p : json.getPairs()) {

                RDMatchPair pair = new RDMatchPair();
                pair.setLeftText(p.getLeftText());
                pair.setRightText(p.getRightText());
                pair.setLeftType(p.getLeftType());
                pair.setRightType(p.getRightType());
                pair.setLeftImage(p.getLeftImage());
                pair.setRightImage(p.getRightImage());
                pair.setDisplayOrder(
                        p.getDisplayOrder() != null
                                ? p.getDisplayOrder()
                                : order++
                );
                pair.setMatchQuestion(question);

                matchPairService.saveMatchPair(pair);
            }

            matchQuestionService.updateTotalPairs(
                    question.getMatchQuestionId());

            ra.addFlashAttribute("success",
                    "Match question and pairs saved successfully");

            return "redirect:/matchpairs/list";

        } catch (Exception e) {
            ra.addFlashAttribute("error",
                    "Upload failed: " + e.getMessage());
            return "redirect:/matchpairs/list";
        }
    }


    /* =========================================================
     * STUDENT – PLAY MODE
     * ========================================================= */

    @GetMapping("/start/{courseSessionDetailId}")
    public String start(
            @PathVariable int courseSessionDetailId,
            Model model) {

        RDMatchQuestion question =
            matchQuestionService
                .findPlayableBySessionDetail(courseSessionDetailId);

        if (question == null || question.getTotalPairs() == 0) {
            model.addAttribute("error",
                    "No matching activity available.");
        } else {
            model.addAttribute("question", question);
        }

        return "matchpairs/matchpair-player";
    }
}
