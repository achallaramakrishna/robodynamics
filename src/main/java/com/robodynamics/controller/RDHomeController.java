package com.robodynamics.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.dto.RDHomeAwarenessUpdateDTO;
import com.robodynamics.model.RDBlogPost;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseCategory;
import com.robodynamics.service.RDBlogPostService;
import com.robodynamics.service.RDCourseCategoryService;
import com.robodynamics.service.RDCourseService;

@Controller
public class RDHomeController {

    @Autowired
    private RDCourseCategoryService courseCategoryService;

    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDBlogPostService blogPostService;

    @GetMapping({"/", "/public/home"})
    public String home(Model model) {
        List<RDCourseCategory> categories = courseCategoryService.getRDCourseCategories();
        List<RDCourse> examPrepCourses = resolveExamPrepCourses();
        List<RDHomeAwarenessUpdateDTO> awarenessUpdates = resolveAwarenessUpdates();
        List<RDHomeAwarenessUpdateDTO> startupCareerUpdates = selectStartupCareerUpdates(awarenessUpdates);
        List<RDHomeAwarenessUpdateDTO> indiaAwarenessUpdates = selectIndiaUpdates(awarenessUpdates);
        List<RDHomeAwarenessUpdateDTO> indiaBuilderUpdates = selectIndiaBuilderUpdates(awarenessUpdates);
        Set<String> usedKeys = new LinkedHashSet<>();
        startupCareerUpdates.forEach(update -> usedKeys.add(uniqueKey(update)));
        indiaBuilderUpdates.forEach(update -> usedKeys.add(uniqueKey(update)));
        List<RDHomeAwarenessUpdateDTO> parentAwarenessUpdates = selectAudienceUpdates(awarenessUpdates, true, usedKeys);
        parentAwarenessUpdates.forEach(update -> usedKeys.add(uniqueKey(update)));
        List<RDHomeAwarenessUpdateDTO> studentAwarenessUpdates = selectAudienceUpdates(awarenessUpdates, false, usedKeys);

        model.addAttribute("categories", categories);
        model.addAttribute("examPrepCourses", examPrepCourses);
        model.addAttribute("awarenessUpdates", awarenessUpdates);
        model.addAttribute("startupCareerUpdates", startupCareerUpdates);
        model.addAttribute("parentAwarenessUpdates", parentAwarenessUpdates);
        model.addAttribute("studentAwarenessUpdates", studentAwarenessUpdates);
        model.addAttribute("indiaAwarenessUpdates", indiaAwarenessUpdates);
        model.addAttribute("indiaBuilderUpdates", indiaBuilderUpdates);
        model.addAttribute("title", "Robo Dynamics - Parent Learning");
        return "home"; // /WEB-INF/views/home.jsp
    }

    @GetMapping({"/insights/{postId}", "/insights/{postId}/{slug}"})
    public String insightArticle(@PathVariable("postId") int postId,
                                 @PathVariable(value = "slug", required = false) String slug,
                                 Model model) {
        RDBlogPost post = blogPostService.getBlogPostById(postId);
        if (post == null || !post.isPublished()) {
            return "redirect:/";
        }
        RDHomeAwarenessUpdateDTO insight = mapToAwarenessUpdate(post);
        model.addAttribute("insight", insight);
        model.addAttribute("title", insight.getTitle());
        model.addAttribute("sourceAvailable", !safe(insight.getSourceUrl()).isBlank());
        boolean aiFocused = isAiFocusedInsight(insight);
        model.addAttribute("aiFocusedInsight", aiFocused);
        model.addAttribute("topAiCareers", aiFocused ? buildTopAiCareersIndia() : Collections.emptyList());
        model.addAttribute("aiNewsPulse", aiFocused ? buildIndiaAiNewsPulse(insight.getHref()) : Collections.emptyList());
        return "awareness-article";
    }

    @GetMapping("/contests")
    public String contests() {
        return "contests";   // contests.jsp
    }

    @GetMapping("/thank-you")
    public String thankYou(@RequestParam(value = "audience", required = false) String audience,
                           @RequestParam(value = "name", required = false) String name,
                           @RequestParam(value = "phone", required = false) String phone,
                           @RequestParam(value = "email", required = false) String email,
                           Model model) {
        model.addAttribute("audience", Optional.ofNullable(audience).orElse("parent"));
        model.addAttribute("name", nvl(name));
        model.addAttribute("phone", nvl(phone));
        model.addAttribute("email", nvl(email));
        return "thank-you"; // /WEB-INF/views/thank-you.jsp
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private List<RDCourse> resolveExamPrepCourses() {
        List<RDCourse> allCourses = courseService.getRDCourses();
        if (allCourses == null || allCourses.isEmpty()) {
            return Collections.emptyList();
        }

        List<RDCourse> activeCourses = allCourses.stream()
                .filter(course -> course != null && course.isActive())
                .collect(Collectors.toList());

        List<RDCourse> boardCourses = activeCourses.stream()
                .filter(this::looksLikeCbseOrIcseCourse)
                .sorted(Comparator.comparingInt(RDCourse::getReviewsCount).reversed())
                .limit(8)
                .collect(Collectors.toList());

        List<RDCourse> examTaggedCourses = activeCourses.stream()
                .filter(this::looksLikeExamPrepCourse)
                .sorted(Comparator.comparingInt(RDCourse::getReviewsCount).reversed())
                .limit(8)
                .collect(Collectors.toList());

        List<RDCourse> prioritized = new ArrayList<>(boardCourses);
        for (RDCourse course : examTaggedCourses) {
            if (prioritized.size() >= 8) {
                break;
            }
            boolean alreadyAdded = prioritized.stream()
                    .anyMatch(existing -> existing.getCourseId() == course.getCourseId());
            if (!alreadyAdded) {
                prioritized.add(course);
            }
        }

        if (prioritized.size() >= 6) {
            return prioritized;
        }

        List<RDCourse> merged = new ArrayList<>(prioritized);
        for (RDCourse course : activeCourses) {
            if (merged.size() >= 8) {
                break;
            }
            boolean alreadyAdded = merged.stream()
                    .anyMatch(existing -> existing.getCourseId() == course.getCourseId());
            if (!alreadyAdded) {
                merged.add(course);
            }
        }
        return merged;
    }

    private boolean looksLikeExamPrepCourse(RDCourse course) {
        String searchable = String.join(" ",
                safe(course.getCourseName()),
                safe(course.getShortDescription()),
                safe(course.getCourseDescription()),
                safe(course.getCategory()),
                course.getCourseCategory() != null ? safe(course.getCourseCategory().getCourseCategoryName()) : "")
                .toLowerCase();

        return searchable.contains("exam")
                || searchable.contains("neet")
                || searchable.contains("jee")
                || searchable.contains("olympiad")
                || searchable.contains("board")
                || searchable.contains("foundation")
                || searchable.contains("prep")
                || searchable.contains("test");
    }

    private boolean looksLikeCbseOrIcseCourse(RDCourse course) {
        String searchable = String.join(" ",
                safe(course.getCourseName()),
                safe(course.getShortDescription()),
                safe(course.getCourseDescription()),
                safe(course.getCategory()),
                course.getCourseCategory() != null ? safe(course.getCourseCategory().getCourseCategoryName()) : "")
                .toLowerCase();

        return searchable.contains("cbse")
                || searchable.contains("icse");
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }

    private List<RDHomeAwarenessUpdateDTO> resolveAwarenessUpdates() {
        List<RDBlogPost> posts = blogPostService.getBlogPosts();
        if (posts == null || posts.isEmpty()) {
            return defaultAwarenessUpdates();
        }

        return posts.stream()
                .filter(post -> post != null && !safe(post.getTitle()).isBlank())
                .sorted(Comparator.comparingInt(RDBlogPost::getId).reversed())
                .limit(6)
                .map(this::mapToAwarenessUpdate)
                .collect(Collectors.toList());
    }

    private RDHomeAwarenessUpdateDTO mapToAwarenessUpdate(RDBlogPost post) {
        RDHomeAwarenessUpdateDTO dto = new RDHomeAwarenessUpdateDTO();
        String rawTitle = safe(post.getTitle()).trim();
        String rawExcerpt = cleanExcerpt(safe(post.getExcerpt()).trim());
        String rawHref = safe(post.getHref()).trim();
        String normalizedSourceHref = normalizeLink(rawHref);
        CompiledInsight compiled = compileInsight(rawTitle, rawExcerpt, rawHref);

        String shareHref = "/insights/" + post.getId() + "/" + slugify(compiled.title);
        String productHref = resolveProductHref(compiled.title, compiled.summary, shareHref);
        boolean hasSource = isExternalLink(normalizedSourceHref) && !isLowValueSourceLink(normalizedSourceHref);

        dto.setType("Insight");
        dto.setTitle(compiled.title);
        dto.setExcerpt(summarizeQuick(compiled.summary, 280));
        dto.setHref(shareHref);
        dto.setImageUrl(resolveImageUrl(safe(post.getImageUrl()).trim(), compiled.title, compiled.fullInfo));
        dto.setCtaLabel(resolveCtaLabel(dto.getType(), dto.getHref()));
        dto.setReadTime(estimateReadTime(compiled.fullInfo));
        dto.setRelevanceNote(resolveParentRelevanceNote(compiled.title, compiled.fullInfo));
        dto.setProductCtaHref(productHref);
        dto.setProductCtaLabel(resolveProductCtaLabel(productHref));
        dto.setExternalSource(hasSource);
        dto.setSourceUrl(hasSource ? normalizedSourceHref : "");
        dto.setSourceLabel(hasSource ? resolveSourceLabel(normalizedSourceHref) : "");
        dto.setCareerTrack(compiled.careerTrack);
        dto.setSkillFocus(compiled.skillFocus);
        dto.setParentAction(compiled.parentAction);
        dto.setFullInfo(summarizeQuick(compiled.fullInfo, 620));
        return dto;
    }

    private String detectUpdateType(String title, String excerpt, String href) {
        String searchable = String.join(" ", safe(title), safe(excerpt), safe(href)).toLowerCase();
        if (isExternalLink(href)) {
            return "News";
        }
        if (searchable.contains("newsletter")) {
            return "Newsletter";
        }
        if (searchable.contains("article")) {
            return "Article";
        }
        return "Blog";
    }

    private String resolveCtaLabel(String type, String href) {
        if ("Insight".equalsIgnoreCase(type)) {
            return "Read Full Brief";
        }
        if (isExternalLink(href)) {
            return "Open Cited Source";
        }
        if ("News".equalsIgnoreCase(type)) {
            return "Read News";
        }
        if ("Newsletter".equalsIgnoreCase(type)) {
            return "Read Newsletter";
        }
        if ("Article".equalsIgnoreCase(type)) {
            return "Read Article";
        }
        return "Read Blog";
    }

    private boolean isExternalLink(String href) {
        String value = safe(href).trim().toLowerCase();
        return value.startsWith("http://") || value.startsWith("https://");
    }

    private String normalizeLink(String href) {
        if (href == null || href.isBlank()) {
            return "/blog";
        }
        if (href.startsWith("http://") || href.startsWith("https://")) {
            return normalizeExternalDisplayLink(href.trim());
        }
        return href.startsWith("/") ? href : "/" + href;
    }

    private String normalizeExternalDisplayLink(String href) {
        String value = safe(href).trim();
        String lower = value.toLowerCase();
        if (lower.isEmpty()) {
            return "/blog";
        }
        if (lower.contains("news.google.com/rss/search")) {
            return value.replace("/rss/search?", "/search?");
        }
        if (lower.contains("thehindu.com/education/feeder/default.rss")) {
            return "https://www.thehindu.com/education/";
        }
        if (lower.contains("indianexpress.com/section/education/feed/")) {
            return "https://indianexpress.com/section/education/";
        }
        if (lower.contains("yourstory.com/feed")) {
            return "https://yourstory.com/";
        }
        if (lower.endsWith(".rss")) {
            int slash = value.lastIndexOf('/');
            if (slash > "https://".length()) {
                return value.substring(0, slash + 1);
            }
        }
        if (lower.endsWith(".xml")) {
            int slash = value.lastIndexOf('/');
            if (slash > "https://".length()) {
                return value.substring(0, slash + 1);
            }
        }
        if (lower.contains("/feed/")) {
            return value.replace("/feed/", "/");
        }
        if (lower.contains("rss")) {
            String q = extractGoogleLikeQuery(value);
            if (!q.isBlank()) {
                return "https://www.google.com/search?q=" + q;
            }
        }
        return value;
    }

    private String extractGoogleLikeQuery(String href) {
        String value = safe(href).trim();
        int qIdx = value.indexOf('?');
        if (qIdx < 0) {
            return "";
        }
        String query = value.substring(qIdx + 1);
        String[] parts = query.split("&");
        for (String part : parts) {
            String p = safe(part).trim();
            if (p.startsWith("q=") && p.length() > 2) {
                return URLDecoder.decode(p.substring(2), StandardCharsets.UTF_8);
            }
        }
        return "";
    }

    private CompiledInsight compileInsight(String title, String excerpt, String href) {
        String cleanTitle = safe(title).trim();
        String cleanExcerpt = cleanExcerpt(excerpt);
        String searchable = (cleanTitle + " " + cleanExcerpt + " " + safe(href)).toLowerCase();

        CompiledInsight insight = new CompiledInsight();
        insight.careerTrack = resolveCareerTrack(cleanTitle, cleanExcerpt);
        insight.skillFocus = resolveSkillFocus(cleanTitle, cleanExcerpt);
        insight.parentAction = resolveParentAction(cleanTitle, cleanExcerpt);

        if (isSpaceSignal(searchable)) {
            insight.title = "India Space Startup Momentum 2026: Skyroot, Agnikul, Pixxel, Dhruva Space";
            insight.summary = "A compiled India brief on SpaceTech startups building launch systems, satellite platforms, and earth-observation products."
                    + " It highlights where student career opportunities are opening over 2026-2036.";
            insight.careerTrack = "SpaceTech Careers (2026-2036)";
            insight.skillFocus = "Math, Physics, Embedded Systems, Data Analysis";
            insight.parentAction = "Parent Action: pick one space startup this week, map what it builds, then map required student skills in AptiPath360.";
            insight.fullInfo = "Companies in focus: Skyroot (private launch vehicles), Agnikul (3D-printed engines), Pixxel (earth observation constellation),"
                    + " Dhruva Space (satellite platforms), and Bellatrix (space propulsion). Hiring signals: avionics, propulsion,"
                    + " embedded software, mission planning, and geospatial analytics. Student skill map: algebra, mechanics,"
                    + " Python/C++, electronics basics, and problem-solving through mini engineering projects.";
            return insight;
        }

        if (isAiStartupSignal(searchable)) {
            insight.title = "Indian AI Startup Hiring Signals 2026: Sarvam AI, Krutrim, Fractal, Yellow.ai";
            insight.summary = "India AI updates this week: who is building language models, enterprise copilots, and conversational products,"
                    + " and what that means for student career readiness.";
            insight.careerTrack = "AI & Data Careers (2026-2036)";
            insight.skillFocus = "Coding, Statistics, Data Literacy, Product Thinking";
            insight.parentAction = "Parent Action: choose one AI startup use-case with your child and map skill gaps in AptiPath360.";
            insight.fullInfo = "India AI companies in focus: Sarvam AI (Indian language stack), Krutrim (consumer + platform AI),"
                    + " Fractal (enterprise decision AI), Yellow.ai (conversational automation), and Mad Street Den (retail vision AI)."
                    + " Current hiring movement is strongest in applied ML, data engineering, evaluation, AI product management, and domain analytics."
                    + " Student starter stack for the next 12 months: Python, SQL, statistics, communication, and mini-project execution.";
            return insight;
        }

        if (isEvClimateSignal(searchable)) {
            insight.title = "India EV and Climate Startup Signals 2026: Ather, Ola Electric, Exponent, Log9";
            insight.summary = "A compiled India brief on mobility and climate startups building batteries, charging systems, and sustainable products."
                    + " It shows where engineering and data roles are expanding.";
            insight.careerTrack = "EV & ClimateTech Careers (2026-2036)";
            insight.skillFocus = "Science, Product Design, Engineering Basics, Data Use";
            insight.parentAction = "Parent Action: discuss one EV or climate startup with your child and map science-to-career actions in AptiPath360.";
            insight.fullInfo = "Companies in focus: Ather and Ola Electric (EV products), Exponent and Log9 (battery and charging innovation),"
                    + " Ultraviolette (performance EV engineering). Hiring signals: battery systems, embedded electronics, quality operations,"
                    + " vehicle software, and product testing. Student skill map: physics, chemistry, CAD basics, coding fundamentals,"
                    + " and systems thinking.";
            return insight;
        }

        if (isExamPolicySignal(searchable)) {
            insight.title = "India Curriculum and Career Shift 2026: What CBSE/NCERT Updates Mean for Students";
            insight.summary = "A compiled interpretation of policy and curriculum signals into monthly student actions."
                    + " It focuses on skills, not only marks.";
            insight.careerTrack = "Academic-to-Career Pathways (2026-2036)";
            insight.skillFocus = "Concept Clarity, Problem Solving, Communication, Consistency";
            insight.parentAction = "Parent Action: convert one policy update into a monthly learning plan in AptiPath360.";
            insight.fullInfo = "Policy signals are increasingly rewarding application-based learning, project work, and communication depth."
                    + " Student preparation should combine core subject clarity with skill demonstrations such as coding tasks,"
                    + " data interpretation, writing, and teamwork. Weekly family review can align exam readiness with long-term career goals.";
            return insight;
        }

        insight.title = cleanTitle;
        if (insight.title.isBlank() || looksGenericHeadline(insight.title)) {
            insight.title = "India Startup and Future Careers Brief 2026: Sector Signals and Student Skill Map";
        }
        insight.summary = cleanExcerpt;
        if (insight.summary.isBlank() || looksGenericExcerpt(insight.summary)) {
            insight.summary = "A compiled India brief connecting startup movement to hiring signals and student skill priorities."
                    + " Use it as a weekly parent-student planning discussion.";
        }
        insight.fullInfo = summarizeQuick(
                "Compiled brief: " + insight.summary
                        + " Hiring signals are stronger in AI/Data, SpaceTech, EV/Climate, and product-led startups."
                        + " Student skill map: coding fundamentals, data literacy, science-math rigor, communication,"
                        + " and execution discipline through mini projects.",
                620);
        return insight;
    }

    private String cleanExcerpt(String excerpt) {
        String cleaned = safe(excerpt).replaceAll("\\s+", " ").trim();
        cleaned = cleaned.replaceAll("(?i)source\\s*:\\s*google\\s*news[^.]*\\.?\\s*", "");
        cleaned = cleaned.replaceAll("(?i)see\\s*original\\s*source\\s*", "");
        cleaned = cleaned.replaceAll("(?i)career\\s*link\\s*:[^.]*\\.?\\s*", "");
        cleaned = cleaned.replaceAll("(?i)skill\\s*focus\\s*:[^.]*\\.?\\s*", "");
        if (cleaned.length() > 900) {
            cleaned = cleaned.substring(0, 900).trim();
        }
        return cleaned;
    }

    private boolean isSpaceSignal(String searchable) {
        return containsAny(searchable, "space", "spacetech", "isro", "satellite", "rocket", "orbit", "skyroot", "agnikul", "pixxel", "dhruva");
    }

    private boolean isAiStartupSignal(String searchable) {
        return containsAny(searchable,
                "ai startup", "artificial intelligence", "machine learning", "genai", "llm",
                "sarvam", "krutrim", "fractal", "yellow.ai", "mad street den")
                || (containsAny(searchable, "ai", "ml", "data") && containsAny(searchable, "startup", "hiring", "innovation"));
    }

    private boolean isEvClimateSignal(String searchable) {
        return containsAny(searchable, "ev", "electric vehicle", "battery", "charging", "climate", "mobility",
                "ather", "ola electric", "exponent", "log9", "ultraviolette");
    }

    private boolean isExamPolicySignal(String searchable) {
        return containsAny(searchable, "cbse", "ncert", "board", "curriculum", "exam", "education policy", "school");
    }

    private boolean looksGenericHeadline(String title) {
        String lower = safe(title).toLowerCase();
        return containsAny(lower,
                "trends parents should track", "quick scan", "monthly update", "future careers in india",
                "top 20 future careers", "what students should start", "startup momentum");
    }

    private boolean looksGenericExcerpt(String excerpt) {
        String lower = safe(excerpt).toLowerCase();
        return containsAny(lower,
                "quick scan", "momentum", "helps convert this into a student plan",
                "source: google news", "share with your network", "weekly parent action plan");
    }

    private boolean isLowValueSourceLink(String href) {
        String value = safe(href).trim().toLowerCase();
        if (value.isBlank() || !isExternalLink(value)) {
            return false;
        }
        if (value.contains("news.google.com/rss/search") || value.contains("news.google.com/search?")) {
            return true;
        }
        if (value.contains("google.com/search?")) {
            return true;
        }
        if (value.endsWith(".rss") || value.endsWith(".xml")) {
            return true;
        }
        if (value.contains("/feed/") || value.endsWith("/feed")) {
            return true;
        }
        return false;
    }

    private String resolveSourceLabel(String href) {
        String value = safe(href).trim();
        if (value.isBlank()) {
            return "";
        }
        try {
            URI uri = URI.create(value);
            String host = safe(uri.getHost()).toLowerCase();
            if (host.startsWith("www.")) {
                host = host.substring(4);
            }
            return host;
        } catch (Exception ignored) {
            return "";
        }
    }

    private String slugify(String input) {
        String slug = safe(input).toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("^-+", "")
                .replaceAll("-+$", "");
        if (slug.length() > 80) {
            slug = slug.substring(0, 80).replaceAll("-+$", "");
        }
        return slug.isBlank() ? "insight" : slug;
    }

    private String resolveImageUrl(String imageUrl, String title, String excerpt) {
        String explicit = safe(imageUrl).trim();
        if (!explicit.isBlank()) {
            return explicit;
        }
        String searchable = (safe(title) + " " + safe(excerpt)).toLowerCase();
        if (containsAny(searchable, "isro", "space", "satellite", "rocket", "mission")) {
            return "/resources/images/robotics.jpg";
        }
        if (containsAny(searchable, "ola", "ev", "electric vehicle", "battery", "mobility")) {
            return "/resources/images/Ai3.jpg";
        }
        if (containsAny(searchable, "cbse", "ncert", "jee", "neet", "board", "exam", "olympiad")) {
            return "/resources/images/mega-olympiad.png";
        }
        if (containsAny(searchable, "startup", "innovation", "funding", "founder", "unicorn", "venture")) {
            return "/resources/images/Ai3.jpg";
        }
        if (containsAny(searchable, "ai", "artificial intelligence", "machine learning", "genai")) {
            return "/resources/images/Ai.jpg";
        }
        if (containsAny(searchable, "coding", "programming", "hackathon", "project", "stem")) {
            return "/resources/images/coding2.jpg";
        }
        if (containsAny(searchable, "career", "future", "skill", "job", "internship")) {
            return "/resources/images/Ai1.jpg";
        }
        if (containsAny(searchable, "tuition", "mentor", "support")) {
            return "/resources/images/mega-tuition.jpg";
        }
        return "/resources/images/hero_parents.jpg";
    }

    private String estimateReadTime(String text) {
        int words = safe(text).trim().isEmpty() ? 0 : safe(text).trim().split("\\s+").length;
        int mins = Math.max(1, (int) Math.ceil(words / 90.0));
        return mins + " min read";
    }

    private String resolveParentRelevanceNote(String title, String excerpt) {
        String searchable = (safe(title) + " " + safe(excerpt)).toLowerCase();
        if (containsAny(searchable, "india", "indian", "startup", "edtech", "iit", "ncert")) {
            return "Relevant for India-specific education and career decisions.";
        }
        if (searchable.contains("career") || searchable.contains("stream") || searchable.contains("skill")) {
            return "Helps with career direction decisions.";
        }
        if (searchable.contains("exam") || searchable.contains("board") || searchable.contains("admission")) {
            return "Useful for exam and admission planning.";
        }
        if (searchable.contains("ai") || searchable.contains("technology") || searchable.contains("learning")) {
            return "Useful for future-skills planning.";
        }
        return "Useful for weekly parent planning.";
    }

    private String resolveProductHref(String title, String excerpt, String href) {
        String searchable = (safe(title) + " " + safe(excerpt) + " " + safe(href)).toLowerCase();
        if (searchable.contains("exam") || searchable.contains("board") || searchable.contains("admission")) {
            return "/exam-prep";
        }
        if (searchable.contains("tuition") || searchable.contains("mentor") || searchable.contains("weak area")) {
            return "/tuition-on-demand";
        }
        return "/registerParentChild?plan=career-basic&redirect=/plans/checkout?plan=career-basic";
    }

    private String resolveProductCtaLabel(String href) {
        String path = safe(href).toLowerCase();
        if (path.contains("/exam-prep")) {
            return "Explore ExamPrep360";
        }
        if (path.contains("/tuition-on-demand")) {
            return "Explore Tuition on Demand";
        }
        return "Start AptiPath360";
    }

    private String resolveCareerTrack(String title, String excerpt) {
        String searchable = (safe(title) + " " + safe(excerpt)).toLowerCase();
        if (containsAny(searchable, "isro", "space", "satellite", "rocket", "mission")) {
            return "SpaceTech Careers (2026-2036)";
        }
        if (containsAny(searchable, "ola", "ev", "electric vehicle", "battery", "mobility")) {
            return "EV & ClimateTech Careers (2026-2036)";
        }
        if (containsAny(searchable, "startup", "founder", "innovation", "funding", "deeptech", "fintech", "agritech")) {
            return "Startup & Innovation Careers (2026-2036)";
        }
        if (containsAny(searchable, "ai", "machine learning", "genai", "data")) {
            return "AI & Data Careers (2026-2036)";
        }
        if (containsAny(searchable, "cbse", "ncert", "jee", "neet", "exam", "board")) {
            return "Academic-to-Career Pathways (2026-2036)";
        }
        return "Future Careers in India (2026-2036)";
    }

    private String resolveSkillFocus(String title, String excerpt) {
        String searchable = (safe(title) + " " + safe(excerpt)).toLowerCase();
        if (containsAny(searchable, "isro", "space", "satellite", "rocket")) {
            return "Math, Physics, Systems Thinking";
        }
        if (containsAny(searchable, "ev", "electric vehicle", "battery", "mobility")) {
            return "Science, Design, Engineering Basics";
        }
        if (containsAny(searchable, "ai", "machine learning", "data", "coding")) {
            return "Coding, Data Literacy, Problem Solving";
        }
        if (containsAny(searchable, "startup", "founder", "innovation")) {
            return "Creativity, Communication, Product Thinking";
        }
        if (containsAny(searchable, "exam", "board", "cbse", "ncert")) {
            return "Concept Clarity, Practice Discipline";
        }
        return "Core STEM + Communication + Decision Skills";
    }

    private String resolveParentAction(String title, String excerpt) {
        String searchable = (safe(title) + " " + safe(excerpt)).toLowerCase();
        if (containsAny(searchable, "isro", "space", "satellite", "rocket")) {
            return "Parent Action: connect this story to one weekly science-math project and review fit in AptiPath360.";
        }
        if (containsAny(searchable, "startup", "ola", "ev", "innovation", "founder")) {
            return "Parent Action: discuss the startup problem solved, then map required skills in AptiPath360.";
        }
        if (containsAny(searchable, "ai", "machine learning", "data")) {
            return "Parent Action: assign one AI/data mini-task and track interest progression in AptiPath360.";
        }
        return "Parent Action: use AptiPath360 to convert this insight into a monthly child skill plan.";
    }

    private String resolveFullInfo(RDHomeAwarenessUpdateDTO dto) {
        String narrative = safe(dto.getExcerpt());
        String track = safe(dto.getCareerTrack());
        String skills = safe(dto.getSkillFocus());
        String action = safe(dto.getParentAction());
        String composed = narrative + " Career Link: " + track + ". Skill Focus: " + skills + ". " + action;
        return summarizeQuick(composed, 420);
    }

    private String summarizeQuick(String text, int maxLen) {
        String clean = safe(text).replaceAll("\\s+", " ").trim();
        if (clean.length() <= maxLen) {
            return clean;
        }
        return clean.substring(0, Math.max(0, maxLen - 3)).trim() + "...";
    }

    private List<RDHomeAwarenessUpdateDTO> defaultAwarenessUpdates() {
        List<RDHomeAwarenessUpdateDTO> fallback = new ArrayList<>();
        fallback.add(buildFallback("Article",
                "Indian AI Startup Hiring Signals 2026: Product, ML, and Data Roles",
                "A compiled brief on how Indian AI startups are building language, automation, and enterprise products and what students should start now.",
                "/about"));
        fallback.add(buildFallback("Blog",
                "India Space Startups 2026: What Skyroot, Agnikul, and Pixxel Are Building",
                "A concrete SpaceTech brief for parents to map science and coding skills to real startup roles.",
                "/blog"));
        fallback.add(buildFallback("Newsletter",
                "Weekly India Career Brief: Startup Signals to Student Action Plan",
                "Use one weekly family discussion to convert startup news into a practical AptiPath360 learning plan.",
                "/contact-us"));
        return fallback;
    }

    private List<RDHomeAwarenessUpdateDTO> selectIndiaUpdates(List<RDHomeAwarenessUpdateDTO> updates) {
        if (updates == null || updates.isEmpty()) {
            return Collections.emptyList();
        }
        List<RDHomeAwarenessUpdateDTO> ranked = updates.stream()
                .sorted(Comparator.comparingInt(this::scoreForIndia).reversed())
                .limit(3)
                .map(update -> cloneForAudience(update, true))
                .collect(Collectors.toList());
        if (!ranked.isEmpty()) {
            return ranked;
        }
        return updates.stream()
                .limit(3)
                .map(update -> cloneForAudience(update, true))
                .collect(Collectors.toList());
    }

    private List<RDHomeAwarenessUpdateDTO> selectStartupCareerUpdates(List<RDHomeAwarenessUpdateDTO> updates) {
        if (updates == null || updates.isEmpty()) {
            return Collections.emptyList();
        }
        List<RDHomeAwarenessUpdateDTO> ranked = updates.stream()
                .sorted(Comparator.comparingInt(this::scoreForStartupCareerConnection).reversed())
                .limit(6)
                .map(update -> cloneForAudience(update, true))
                .collect(Collectors.toList());
        if (!ranked.isEmpty()) {
            return ranked;
        }
        return updates.stream()
                .limit(6)
                .map(update -> cloneForAudience(update, true))
                .collect(Collectors.toList());
    }

    private int scoreForStartupCareerConnection(RDHomeAwarenessUpdateDTO update) {
        String searchable = (safe(update.getTitle()) + " " + safe(update.getExcerpt()) + " " + safe(update.getCareerTrack())).toLowerCase();
        int score = 0;
        if (containsAny(searchable, "india", "indian", "startup", "innovation", "founder", "funding", "deeptech", "fintech", "agritech")) {
            score += 6;
        }
        if (containsAny(searchable, "isro", "ola", "space", "satellite", "ev", "electric vehicle", "ai", "data")) {
            score += 6;
        }
        if (containsAny(searchable, "career", "skills", "student", "future", "2030", "2036")) {
            score += 4;
        }
        return score;
    }

    private List<RDHomeAwarenessUpdateDTO> selectIndiaBuilderUpdates(List<RDHomeAwarenessUpdateDTO> updates) {
        if (updates == null || updates.isEmpty()) {
            return Collections.emptyList();
        }
        return updates.stream()
                .sorted(Comparator.comparingInt(this::scoreForIndiaBuilders).reversed())
                .limit(3)
                .map(update -> cloneForAudience(update, false))
                .collect(Collectors.toList());
    }

    private int scoreForIndiaBuilders(RDHomeAwarenessUpdateDTO update) {
        String searchable = (safe(update.getTitle()) + " " + safe(update.getExcerpt()) + " " + safe(update.getRelevanceNote())).toLowerCase();
        int score = 0;
        if (containsAny(searchable, "india", "indian", "startup", "innovation", "founder", "funding")) {
            score += 5;
        }
        if (containsAny(searchable, "isro", "ola", "zoho", "infosys", "tcs", "wipro", "paytm", "flipkart", "byju", "zerodha")) {
            score += 6;
        }
        if (containsAny(searchable, "ai", "robotics", "space", "ev", "deeptech", "science")) {
            score += 4;
        }
        if (containsAny(searchable, "student", "career", "skill", "learning")) {
            score += 3;
        }
        return score;
    }

    private int scoreForIndia(RDHomeAwarenessUpdateDTO update) {
        String searchable = (safe(update.getTitle()) + " " + safe(update.getExcerpt()) + " " + safe(update.getRelevanceNote())).toLowerCase();
        int score = 0;
        if (containsAny(searchable, "india", "indian", "cbse", "icse", "ncert", "jee", "neet", "iit", "edtech")) {
            score += 6;
        }
        if (containsAny(searchable, "ai", "artificial intelligence", "startup", "innovation", "funding", "career")) {
            score += 4;
        }
        if (containsAny(searchable, "student", "skill", "learning", "future")) {
            score += 2;
        }
        return score;
    }

    private RDHomeAwarenessUpdateDTO buildFallback(String type, String title, String excerpt, String href) {
        RDHomeAwarenessUpdateDTO dto = new RDHomeAwarenessUpdateDTO();
        dto.setType(type);
        dto.setTitle(title);
        dto.setExcerpt(excerpt);
        dto.setHref(href);
        dto.setImageUrl(resolveImageUrl("", title, excerpt));
        dto.setCtaLabel(resolveCtaLabel(type, href));
        dto.setReadTime(estimateReadTime(excerpt));
        dto.setRelevanceNote(resolveParentRelevanceNote(title, excerpt));
        String productHref = resolveProductHref(title, excerpt, href);
        dto.setProductCtaHref(productHref);
        dto.setProductCtaLabel(resolveProductCtaLabel(productHref));
        dto.setExternalSource(isExternalLink(href));
        dto.setCareerTrack(resolveCareerTrack(title, excerpt));
        dto.setSkillFocus(resolveSkillFocus(title, excerpt));
        dto.setParentAction(resolveParentAction(title, excerpt));
        dto.setFullInfo(resolveFullInfo(dto));
        return dto;
    }

    private List<RDHomeAwarenessUpdateDTO> selectAudienceUpdates(List<RDHomeAwarenessUpdateDTO> updates,
                                                                 boolean parentAudience,
                                                                 Set<String> excludedKeys) {
        if (updates == null || updates.isEmpty()) {
            return Collections.emptyList();
        }

        Set<String> blocked = excludedKeys == null ? Collections.emptySet() : excludedKeys;
        List<RDHomeAwarenessUpdateDTO> selected = updates.stream()
                .filter(update -> !blocked.contains(uniqueKey(update)))
                .sorted(Comparator.comparingInt((RDHomeAwarenessUpdateDTO update)
                        -> scoreForAudience(update, parentAudience)).reversed())
                .limit(4)
                .map(update -> cloneForAudience(update, parentAudience))
                .collect(Collectors.toList());

        if (selected.size() >= 4) {
            return selected;
        }

        Set<String> chosenKeys = selected.stream()
                .map(this::uniqueKey)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        for (RDHomeAwarenessUpdateDTO update : updates) {
            String key = uniqueKey(update);
            if (blocked.contains(key) || chosenKeys.contains(key)) {
                continue;
            }
            selected.add(cloneForAudience(update, parentAudience));
            chosenKeys.add(key);
            if (selected.size() >= 4) {
                break;
            }
        }
        return selected;
    }

    private int scoreForAudience(RDHomeAwarenessUpdateDTO update, boolean parentAudience) {
        String searchable = (safe(update.getTitle()) + " " + safe(update.getExcerpt()) + " " + safe(update.getRelevanceNote())).toLowerCase();
        int score = 0;
        if (parentAudience) {
            if (containsAny(searchable, "india", "indian", "startup", "edtech", "ncert", "jee", "neet")) {
                score += 3;
            }
            if (containsAny(searchable, "parent", "admission", "planning", "board", "school", "policy", "fees", "safety")) {
                score += 4;
            }
            if (containsAny(searchable, "career", "future", "exam", "stream", "roadmap")) {
                score += 2;
            }
            return score;
        }

        if (containsAny(searchable, "student", "learn", "study", "project", "practice", "skill", "career", "future")) {
            score += 4;
        }
        if (containsAny(searchable, "india", "indian", "startup", "edtech", "ncert", "jee", "neet")) {
            score += 3;
        }
        if (containsAny(searchable, "ai", "coding", "math", "science", "exam", "scholarship", "college")) {
            score += 2;
        }
        return score;
    }

    private RDHomeAwarenessUpdateDTO cloneForAudience(RDHomeAwarenessUpdateDTO source, boolean parentAudience) {
        RDHomeAwarenessUpdateDTO clone = new RDHomeAwarenessUpdateDTO();
        clone.setType(source.getType());
        clone.setTitle(source.getTitle());
        clone.setExcerpt(source.getExcerpt());
        clone.setHref(source.getHref());
        clone.setImageUrl(source.getImageUrl());
        clone.setCtaLabel(source.getCtaLabel());
        clone.setReadTime(source.getReadTime());
        clone.setExternalSource(source.isExternalSource());
        clone.setCareerTrack(source.getCareerTrack());
        clone.setSkillFocus(source.getSkillFocus());
        clone.setParentAction(source.getParentAction());
        clone.setFullInfo(source.getFullInfo());
        clone.setSourceUrl(source.getSourceUrl());
        clone.setSourceLabel(source.getSourceLabel());

        if (parentAudience) {
            clone.setRelevanceNote(safe(source.getRelevanceNote()).isBlank()
                    ? "Useful for weekly parent planning."
                    : source.getRelevanceNote());
            clone.setProductCtaHref(source.getProductCtaHref());
            clone.setProductCtaLabel(source.getProductCtaLabel());
            return clone;
        }

        clone.setRelevanceNote(resolveStudentRelevanceNote(source));
        clone.setProductCtaHref(resolveStudentProductHref(source));
        clone.setProductCtaLabel(resolveStudentProductLabel(clone.getProductCtaHref()));
        clone.setFullInfo(summarizeQuick(
                safe(source.getExcerpt()) + " Student Focus: " + safe(clone.getSkillFocus()) + ". " + safe(clone.getRelevanceNote()),
                420));
        return clone;
    }

    private String resolveStudentRelevanceNote(RDHomeAwarenessUpdateDTO source) {
        String searchable = (safe(source.getTitle()) + " " + safe(source.getExcerpt())).toLowerCase();
        if (containsAny(searchable, "isro", "space", "satellite", "rocket", "mission")) {
            return "Students can connect this to science, math, and space-tech career pathways.";
        }
        if (containsAny(searchable, "ola", "ev", "electric vehicle", "battery", "mobility")) {
            return "Students can connect this to EV engineering, design, and climate-tech skills.";
        }
        if (containsAny(searchable, "india", "indian", "startup", "edtech", "innovation")) {
            return "Students can learn from India startup stories and build future-ready skills.";
        }
        if (containsAny(searchable, "exam", "board", "practice", "test")) {
            return "Students can use this for smarter exam practice.";
        }
        if (containsAny(searchable, "career", "future", "skill", "college")) {
            return "Students can use this to decide next skills and career actions.";
        }
        if (containsAny(searchable, "ai", "coding", "math", "science")) {
            return "Students can learn this early to stay ahead.";
        }
        return "Students can learn and discuss this with parents this week.";
    }

    private String resolveStudentProductHref(RDHomeAwarenessUpdateDTO source) {
        String searchable = (safe(source.getTitle()) + " " + safe(source.getExcerpt()) + " " + safe(source.getProductCtaHref())).toLowerCase();
        if (containsAny(searchable, "exam", "board", "test", "/exam-prep")) {
            return "/exam-prep";
        }
        if (containsAny(searchable, "tuition", "mentor", "/tuition-on-demand")) {
            return "/tuition-on-demand";
        }
        return "/registerParentChild?plan=career-basic&redirect=/plans/checkout?plan=career-basic";
    }

    private String resolveStudentProductLabel(String href) {
        String path = safe(href).toLowerCase();
        if (path.contains("/exam-prep")) {
            return "Practice with ExamPrep360";
        }
        if (path.contains("/tuition-on-demand")) {
            return "Get Targeted Tuition";
        }
        return "Ask Parent to Start AptiPath360";
    }

    private boolean isAiFocusedInsight(RDHomeAwarenessUpdateDTO insight) {
        if (insight == null) {
            return false;
        }
        String searchable = (safe(insight.getTitle()) + " " + safe(insight.getExcerpt()) + " "
                + safe(insight.getCareerTrack()) + " " + safe(insight.getSkillFocus())).toLowerCase();
        return containsAny(searchable, "ai", "artificial intelligence", "machine learning", "genai", "llm", "data");
    }

    private List<String> buildTopAiCareersIndia() {
        return Arrays.asList(
                "AI/ML Engineer",
                "GenAI Application Developer",
                "Data Engineer",
                "MLOps Engineer",
                "Prompt Engineer",
                "NLP Engineer",
                "Computer Vision Engineer",
                "Speech and Conversational AI Engineer",
                "AI Product Manager",
                "AI Business Analyst",
                "AI Quality and Evaluation Analyst",
                "AI Safety and Governance Analyst",
                "Applied Research Engineer",
                "Recommendation Systems Engineer",
                "Edge AI Engineer",
                "Robotics AI Engineer",
                "AI Solutions Architect",
                "AI Integration Consultant",
                "Domain Data Analyst (Health/Finance/Retail)",
                "AI Educator and Curriculum Designer"
        );
    }

    private List<RDHomeAwarenessUpdateDTO> buildIndiaAiNewsPulse(String currentInsightHref) {
        List<RDHomeAwarenessUpdateDTO> updates = resolveAwarenessUpdates();
        if (updates == null || updates.isEmpty()) {
            return Collections.emptyList();
        }

        List<RDHomeAwarenessUpdateDTO> pulse = updates.stream()
                .filter(update -> update != null)
                .filter(update -> !safe(update.getHref()).equalsIgnoreCase(safe(currentInsightHref)))
                .filter(this::isIndiaAiNewsSignal)
                .limit(6)
                .map(update -> cloneForAudience(update, true))
                .collect(Collectors.toList());

        if (pulse.size() >= 4) {
            return pulse;
        }

        Set<String> existing = pulse.stream()
                .map(this::uniqueKey)
                .collect(Collectors.toCollection(LinkedHashSet::new));

        for (RDHomeAwarenessUpdateDTO update : updates) {
            if (update == null) {
                continue;
            }
            if (safe(update.getHref()).equalsIgnoreCase(safe(currentInsightHref))) {
                continue;
            }
            String key = uniqueKey(update);
            if (existing.contains(key)) {
                continue;
            }
            pulse.add(cloneForAudience(update, true));
            existing.add(key);
            if (pulse.size() >= 6) {
                break;
            }
        }

        return pulse;
    }

    private boolean isIndiaAiNewsSignal(RDHomeAwarenessUpdateDTO update) {
        if (update == null) {
            return false;
        }
        String searchable = (safe(update.getTitle()) + " " + safe(update.getExcerpt()) + " "
                + safe(update.getCareerTrack()) + " " + safe(update.getSourceLabel())).toLowerCase();
        return containsAny(searchable, "india", "indian", "bengaluru", "hyderabad", "pune", "chennai", "delhi")
                && containsAny(searchable, "ai", "artificial intelligence", "machine learning", "genai", "llm", "data");
    }

    private static final class CompiledInsight {
        private String title;
        private String summary;
        private String fullInfo;
        private String careerTrack;
        private String skillFocus;
        private String parentAction;
    }

    private boolean containsAny(String text, String... tokens) {
        if (text == null || tokens == null) {
            return false;
        }
        for (String token : tokens) {
            if (token != null && !token.isBlank() && text.contains(token)) {
                return true;
            }
        }
        return false;
    }

    private String uniqueKey(RDHomeAwarenessUpdateDTO update) {
        if (update == null) {
            return "";
        }
        return (safe(update.getTitle()) + "|" + safe(update.getHref())).toLowerCase();
    }

    @GetMapping("/competitions")
    public String competitions() {
        return "competitions";
    }

    @GetMapping("/competitions/faq")
    public String competitionFaq() {
        return "competitions-faq";
    }

}
