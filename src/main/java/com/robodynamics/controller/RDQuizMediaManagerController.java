package com.robodynamics.controller;

import com.robodynamics.model.*;
import com.robodynamics.service.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin/quizzes/media")
public class RDQuizMediaManagerController {

    @Autowired private RDCourseService courseService;
    @Autowired private RDCourseSessionService courseSessionService;
    @Autowired private RDCourseSessionDetailService courseSessionDetailService;
    @Autowired private RDQuizService quizService;
    @Autowired private RDQuizQuestionService questionService;
    @Autowired private RDQuizQuestionMapService questionMapService; // quiz<->question mapping

    // === File storage config (Linux) ===
    @Value("${file.storage.disk-root:/opt/robodynamics}")
    private String diskRoot; // Filesystem root; files will go under /opt/robodynamics/uploads/...

    // If true, store absolute FS path (/opt/robodynamics/...) instead of URL (/robodynamics/uploads/...)
    @Value("${file.storage.return-fs-path:false}")
    private boolean returnFsPath;

    /** Page */
    @GetMapping("/manage")
    public String showMediaManager(Model model) {
        List<RDCourse> courses = courseService.getRDCourses();
        model.addAttribute("courses", courses);
        return "quizquestions/quizMediaManager";
    }

    /** AJAX: sessions by course */
    @GetMapping(value = "/sessions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Map<String, Object>> getSessions(@RequestParam int courseId) {
        List<RDCourseSession> sessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        return sessions.stream().map(s -> {
            Map<String, Object> m = new HashMap<>();
            m.put("sessionId", s.getCourseSessionId());
            m.put("sessionTitle", s.getSessionTitle());
            m.put("sessionType", s.getSessionType());
            m.put("tierLevel", s.getTierLevel() != null ? s.getTierLevel().name() : null);
            return m;
        }).collect(Collectors.toList());
    }

    /** AJAX: session details by session */
    @GetMapping(value = "/session-details", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Map<String, Object>> getSessionDetails(@RequestParam int sessionId) {
        List<RDCourseSessionDetail> details = courseSessionDetailService.findSessionDetailsBySessionId(sessionId);
        return details.stream().map(d -> {
            Map<String, Object> m = new HashMap<>();
            m.put("sessionDetailId", d.getCourseSessionDetailId());
            m.put("topic", d.getTopic());
            m.put("type", d.getType());
            m.put("file", d.getFile());
            m.put("tierLevel", d.getTierLevel() != null ? d.getTierLevel().name() : null);
            return m;
        }).collect(Collectors.toList());
    }

    /** AJAX: quizzes filtered by course/session/sessionDetail */
    @GetMapping(value = "/quizzes", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Map<String, Object>> getQuizzes(
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) Integer sessionId,
            @RequestParam(required = false) Integer sessionDetailId) {

        List<RDQuiz> quizzes = quizService.findByFilters(courseId, sessionId, sessionDetailId);

        return quizzes.stream().map(q -> {
            Map<String, Object> m = new HashMap<>();
            m.put("quizId", q.getQuizId());
            m.put("quizName", q.getQuizName());
            m.put("shortDescription", q.getShortDescription());
            return m;
        }).collect(Collectors.toList());
    }

    /** AJAX: questions for table */
    @GetMapping(value = "/questions", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<Map<String, Object>> listQuestions(
            @RequestParam(required = false) Integer courseId,
            @RequestParam(required = false) Integer sessionId,
            @RequestParam(required = false) Integer sessionDetailId,
            @RequestParam(required = false) Integer quizId) {

        List<RDQuizQuestion> questions = questionService.findByFilters(courseId, sessionId, sessionDetailId, quizId);

        return questions.stream().map(q -> {
            Map<String, Object> m = new HashMap<>();
            m.put("questionId", q.getQuestionId());
            m.put("questionText", q.getQuestionText());
            m.put("questionType", q.getQuestionType());
            m.put("difficultyLevel", q.getDifficultyLevel());

            boolean hasQImage = q.getQuestionImage() != null && !q.getQuestionImage().isEmpty();
            boolean hasAnyOptImage = q.getOptions() != null &&
                    q.getOptions().stream().anyMatch(o -> o.getOptionImage() != null && !o.getOptionImage().isEmpty());

            m.put("hasQImage", hasQImage);
            m.put("hasAnyOptionImage", hasAnyOptImage);
            return m;
        }).collect(Collectors.toList());
    }

    /* ===================== VIEW: HTML preview ===================== */
    @GetMapping(value = "/preview", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String previewQuestion(@RequestParam int questionId, HttpServletRequest req) {
        RDQuizQuestion q = questionService.findById(questionId);
        if (q == null) return "<div class='text-danger'>Question not found.</div>";

        StringBuilder sb = new StringBuilder();
        sb.append("<div class='mb-3'><strong>Q").append(q.getQuestionId()).append(".</strong> ")
          .append(escapeHtml(q.getQuestionText())).append("</div>");

        String qImg = toWebPath(q.getQuestionImage(), req);
        if (qImg != null && !qImg.isEmpty()) {
            sb.append("<div class='mb-3'><img class='img-fluid' src='")
              .append(escapeHtml(qImg))
              .append("' alt='question image'/></div>");
        }

        List<RDQuizOption> opts = q.getOptions() != null ? q.getOptions() : Collections.emptyList();
        if (!opts.isEmpty()) {
            sb.append("<ol type='A'>");
            for (RDQuizOption o : opts) {
                sb.append("<li class='mb-2'>")
                  .append(escapeHtml(o.getOptionText() == null ? "" : o.getOptionText()));
                String oImg = toWebPath(o.getOptionImage(), req);
                if (oImg != null && !oImg.isEmpty()) {
                    sb.append("<div><img class='img-fluid mt-1' style='max-height:160px' src='")
                      .append(escapeHtml(oImg))
                      .append("' alt='option image'/></div>");
                }
                sb.append("</li>");
            }
            sb.append("</ol>");
        }
        return sb.toString();
    }

    /** FETCH: JSON for upload modal */
    @GetMapping(value = "/question", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String, Object> getQuestion(@RequestParam int questionId, HttpServletRequest req) {
        RDQuizQuestion q = questionService.findById(questionId);
        if (q == null) return Collections.singletonMap("error", "Question not found");

        Map<String,Object> m = new HashMap<>();
        m.put("questionId", q.getQuestionId());
        m.put("questionText", q.getQuestionText());
        m.put("questionImage", toWebPath(q.getQuestionImage(), req));

        // all mapped quizIds for this question
        List<Integer> quizIds = resolveQuizIdsForQuestion(questionId);
        m.put("quizIds", quizIds);

        List<Map<String,Object>> options = new ArrayList<>();
        if (q.getOptions() != null) {
            for (RDQuizOption o : q.getOptions()) {
                Map<String,Object> om = new HashMap<>();
                om.put("optionId", o.getOptionId());
                om.put("optionText", o.getOptionText());
                om.put("optionImage", toWebPath(o.getOptionImage(), req));
                options.add(om);
            }
        }
        m.put("options", options);
        return m;
    }

    /** SAVE: multipart upload */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public Map<String,Object> uploadImages(
            @RequestParam int questionId,
            @RequestParam(required = false) Integer quizId,  // optional
            @RequestParam(required = false) MultipartFile qImage,
            @RequestParam(required = false, defaultValue = "0") int qRemove,
            @RequestParam Map<String,String> formFields,
            HttpServletRequest request
    ) {
        Map<String,Object> resp = new HashMap<>();
        RDQuizQuestion q = questionService.findById(questionId);
        if (q == null) {
            resp.put("ok", false);
            resp.put("message", "Question not found");
            return resp;
        }

        // Resolve all uploaded files
        Map<String, MultipartFile> fileMap = Collections.emptyMap();
        if (request instanceof MultipartHttpServletRequest) {
            fileMap = ((MultipartHttpServletRequest) request).getFileMap();
        }

        // Determine folder (prefer provided quizId, else first mapped quiz, else generic)
        Integer targetQuizId = (quizId != null) ? quizId : resolveOneQuizIdOrNull(questionId);
        String baseFolder = (targetQuizId != null)
                ? "/uploads/quiz/" + targetQuizId + "/q_" + questionId + "/"
                : "/uploads/questions/q_" + questionId + "/";

        // Question image
        if (qRemove == 1) {
            q.setQuestionImage(null);
        } else if (qImage != null && !qImage.isEmpty()) {
            String savedUrlOrPath = storeFile(request, baseFolder, "question_", qImage);
            q.setQuestionImage(savedUrlOrPath);
        }

        // Option images
        if (q.getOptions() != null) {
            for (RDQuizOption o : q.getOptions()) {
                String removeFlag = formFields.getOrDefault("oRemove_" + o.getOptionId(), "0");
                if ("1".equals(removeFlag)) {
                    o.setOptionImage(null);
                    continue;
                }
                MultipartFile ofile = fileMap.get("oImage_" + o.getOptionId());
                if (ofile != null && !ofile.isEmpty()) {
                    String savedUrlOrPath = storeFile(request, baseFolder, "option_" + o.getOptionId() + "_", ofile);
                    o.setOptionImage(savedUrlOrPath);
                }
            }
        }

        questionService.saveOrUpdate(q); // persist question + options

        resp.put("ok", true);
        resp.put("message", "Images updated");
        return resp;
    }

    /* -------------------- Helpers -------------------- */
    private List<Integer> resolveQuizIdsForQuestion(int questionId) {
        List<RDQuizQuestionMap> maps = questionMapService.findByQuestionId(questionId);
        if (maps == null || maps.isEmpty()) return Collections.emptyList();
        return maps.stream()
                   .map(m -> m.getQuiz().getQuizId())
                   .distinct()
                   .collect(Collectors.toList());
    }

    private Integer resolveOneQuizIdOrNull(int questionId) {
        List<Integer> ids = resolveQuizIdsForQuestion(questionId);
        return ids.isEmpty() ? null : ids.get(0);
    }

    private static String escapeHtml(String s){
        if (s == null) return "";
        return s.replace("&","&amp;")
                .replace("<","&lt;")
                .replace(">","&gt;")
                .replace("\"","&quot;")
                .replace("'","&#39;");
    }

    /**
     * Writes to: diskRoot + baseFolder + filename
     *           (e.g., /opt/robodynamics/uploads/quiz/56/q_2085/xxx.png)
     * Returns:  <contextPath> + baseFolder + filename
     *           (e.g., /robodynamics/uploads/quiz/56/q_2085/xxx.png)
     *           OR absolute FS path if returnFsPath=true
     */
    private String storeFile(HttpServletRequest request, String baseFolder, String prefix, MultipartFile file) {
        try {
            String original = (file.getOriginalFilename() != null) ? file.getOriginalFilename() : "file";
            String ext = "";
            int dot = original.lastIndexOf('.');
            if (dot >= 0) ext = original.substring(dot);
            String name = prefix + System.currentTimeMillis() + ext;

            // Normalize base folder (leading slash, forward slashes)
            String cleanBaseFolder = baseFolder.replace("\\", "/");
            if (!cleanBaseFolder.startsWith("/")) cleanBaseFolder = "/" + cleanBaseFolder;

            // 1) Write to disk
            Path folder = Paths.get(diskRoot).resolve(cleanBaseFolder.substring(1)); // drop leading '/'
            Files.createDirectories(folder);
            Path dest = folder.resolve(name);
            file.transferTo(dest.toFile());

            // 2) Return FS path or a context-aware URL (no /assets)
            if (returnFsPath) {
                return dest.toAbsolutePath().toString(); // e.g., /opt/robodynamics/uploads/...
            } else {
                String contextPath = request.getContextPath(); // e.g., "/robodynamics" or ""
                return joinPath(contextPath, cleanBaseFolder, name); // => /robodynamics/uploads/...
            }
        } catch (Exception ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }

    /** Normalize any stored path to a web path under the current context. */
    private String toWebPath(String path, HttpServletRequest req) {
        if (path == null || path.isEmpty()) return path;
        String p = path.replace("\\", "/");

        // If absolute http(s), just fix leaked /opt prefix if present
        if (p.startsWith("http://") || p.startsWith("https://")) {
            return p.replace("/opt/robodynamics/", req.getContextPath() + "/");
        }

        // If it starts with physical disk root, replace with context
        String dr = diskRoot.replace("\\", "/");
        if (!dr.endsWith("/")) dr += "/";
        if (p.startsWith(dr)) {
            return (req.getContextPath() + "/" + p.substring(dr.length())).replaceAll("/{2,}","/");
        }

        // If it is a pure uploads path, prefix context
        if (p.startsWith("/uploads/")) {
            return (req.getContextPath() + p).replaceAll("/{2,}","/");
        }

        // If already prefixed with context or /robodynamics/, return as is
        if (p.startsWith(req.getContextPath() + "/") || p.startsWith("/robodynamics/")) {
            return p;
        }

        // Fallback: if root path, prefix context; else return as-is
        if (p.startsWith("/")) {
            return (req.getContextPath() + p).replaceAll("/{2,}","/");
        }
        return p;
    }

    /** Join URL segments with single slashes; keeps leading slash. */
    private static String joinPath(String... parts) {
        StringBuilder sb = new StringBuilder();
        for (String p : parts) {
            if (p == null || p.isEmpty()) continue;
            String s = p.replace("\\", "/");
            if (sb.length() == 0) {
                if (!s.startsWith("/")) s = "/" + s;
                sb.append(s);
            } else {
                if (sb.charAt(sb.length() - 1) == '/') sb.setLength(sb.length() - 1);
                if (!s.startsWith("/")) sb.append('/');
                sb.append(s);
            }
        }
        return sb.toString().replaceAll("/{2,}", "/");
    }
}
