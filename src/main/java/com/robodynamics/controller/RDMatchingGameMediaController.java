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
@RequestMapping("/matching/media")
public class RDMatchingGameMediaController {

    /* ================= SERVICES ================= */

    @Autowired private RDCourseService courseService;
    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDCourseSessionDetailService courseSessionDetailService;

    @Autowired private RDMatchingGameService matchingGameService;
    @Autowired private RDMatchingCategoryService matchingCategoryService;
    @Autowired private RDMatchingItemService matchingItemService;

    /* ================= FILE STORAGE ================= */

    @Value("${rd.session.materials.base:/opt/robodynamics/session_materials}")
    private String materialsBase;

    private Path matchingFolder(int courseId) {
        return Paths.get(materialsBase, String.valueOf(courseId), "matching");
    }

 

    /* ================= PAGE ================= */

    @GetMapping("/manage")
    public String managePage(Model model) {
        model.addAttribute("courses", courseService.getRDCourses());
        return "matching-game/matchingMediaManager";
    }

    /* ================= CASCADING ================= */

    @GetMapping("/sessions")
    @ResponseBody
    public List<Map<String,Object>> sessions(@RequestParam int courseId) {
        List<Map<String,Object>> list = new ArrayList<>();
        for (RDCourseSession s : courseSessionService.getCourseSessionsByCourseId(courseId)) {
            Map<String,Object> m = new HashMap<>();
            m.put("sessionId", s.getCourseSessionId());
            m.put("sessionTitle", s.getSessionTitle());
            list.add(m);
        }
        return list;
    }

    @GetMapping("/session-details")
    @ResponseBody
    public List<Map<String,Object>> sessionDetails(@RequestParam int sessionId) {
        List<Map<String,Object>> list = new ArrayList<>();
        for (RDCourseSessionDetail d :
                courseSessionDetailService.findSessionDetailsBySessionId(sessionId)) {
            Map<String,Object> m = new HashMap<>();
            m.put("sessionDetailId", d.getCourseSessionDetailId());
            m.put("topic", d.getTopic());
            list.add(m);
        }
        return list;
    }

    @GetMapping("/games")
    @ResponseBody
    public List<Map<String,Object>> games(@RequestParam int courseSessionDetailId) {
        RDMatchingGame g =
            matchingGameService.getGameByCourseSessionDetails(courseSessionDetailId);

        if (g == null) return Collections.emptyList();

        Map<String,Object> m = new HashMap<>();
        m.put("gameId", g.getGameId());
        m.put("name", g.getName());

        return List.of(m);
    }

    @GetMapping("/categories")
    @ResponseBody
    public List<Map<String,Object>> categories(@RequestParam int gameId) {
        List<Map<String,Object>> list = new ArrayList<>();
        for (RDMatchingCategory c :
                matchingCategoryService.getCategoriesByGameId(gameId)) {
            Map<String,Object> m = new HashMap<>();
            m.put("categoryId", c.getCategoryId());
            m.put("categoryName", c.getCategoryName());
            m.put("hasImage", c.getImageName() != null);
            list.add(m);
        }
        return list;
    }

    /* ================= ITEMS ================= */

    @GetMapping("/items")
    @ResponseBody
    public List<Map<String,Object>> items(@RequestParam int categoryId) {
        List<Map<String,Object>> list = new ArrayList<>();
        for (RDMatchingItem i :
                matchingItemService.getItemsByCategoryId(categoryId)) {
            Map<String,Object> m = new HashMap<>();
            m.put("itemId", i.getItemId());
            m.put("itemName", i.getItemName());
            m.put("matchingText", i.getMatchingText());
            m.put("hasImage", i.getImageName() != null);
            list.add(m);
        }
        return list;
    }

    @GetMapping("/item")
    @ResponseBody
    public Map<String,Object> getItem(@RequestParam int itemId) {
        RDMatchingItem item = matchingItemService.getItemById(itemId);

        Map<String,Object> m = new HashMap<>();
        if (item != null) {
            m.put("itemId", item.getItemId());
            m.put("itemName", item.getItemName());
            m.put("matchingText", item.getMatchingText());
            m.put("imageName", item.getImageName());
        }
        return m;
    }

    /* ================= UPLOAD ITEM ================= */

    @Transactional
    @PostMapping(
        value = "/upload-item",
        consumes = "multipart/form-data",
        produces = "application/json"
    )
    @ResponseBody
    public Map<String,Object> uploadItemImage(
            @RequestParam int itemId,
            @RequestParam(required=false) MultipartFile image,
            @RequestParam(defaultValue="0") int remove) {

        Map<String,Object> res = new HashMap<>();

        try {
            RDMatchingItem item = matchingItemService.getItemById(itemId);
            if (item == null) {
                res.put("ok", false);
                res.put("message", "Item not found");
                return res;
            }

            int courseId =
                item.getCategory().getGame()
                    .getCourseSessionDetail()
                    .getCourse().getCourseId();

            Path folder = matchingFolder(courseId);
            Files.createDirectories(folder);

            if (remove == 1) item.setImageName(null);

            if (image != null && !image.isEmpty()) {
                String name = "item_" + itemId + "_" +
                        StringUtils.cleanPath(image.getOriginalFilename());
                image.transferTo(folder.resolve(name));
                item.setImageName(name);
            }

            matchingItemService.saveItem(item);

            res.put("ok", true);
            return res;

        } catch (Exception e) {
            res.put("ok", false);
            res.put("message", e.getMessage());
            return res;
        }
    }
}
