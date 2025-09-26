package com.robodynamics.controller;

import com.robodynamics.service.RDBlogPostService;
import com.robodynamics.service.RDCollectionService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDDemoService;
import com.robodynamics.service.RDMentorService;
import com.robodynamics.service.RDSkillService;
import com.robodynamics.service.RDTestimonialService;
import com.robodynamics.service.RDLeadService;
import com.robodynamics.service.RDLeadSkillService;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDDemo;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDLeadSkill;
import com.robodynamics.model.RDSkill;
import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.model.RDBlogPost;
import com.robodynamics.model.RDCollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;

@Controller
public class RDHomeController {

    @Autowired private RDCourseService courseService;
    @Autowired private RDMentorService mentorService;
    @Autowired private RDCollectionService collectionService;
    @Autowired private RDDemoService demoService;
    @Autowired private RDBlogPostService blogPostService;
    @Autowired private RDTestimonialService testimonialService;

    @Autowired private RDSkillService skillService;
    @Autowired private RDLeadSkillService leadSkillService;

    @Autowired private RDLeadService leadService; // now uses createLead(...) to always insert

    @GetMapping({ "/", "/home" })
    public String home(@RequestParam(value = "viewer", required = false) String viewer,
                       @RequestParam(value = "q", required = false) String q,
                       Model model, HttpServletRequest req) {

        // 0) A/B variant for copy/CTA (server-side 50/50)
        boolean abVariantB = ThreadLocalRandom.current().nextBoolean();
        model.addAttribute("ab_variant", abVariantB ? "B" : "A");

        // 1) viewer toggle (default parent)
        if (viewer == null || viewer.isBlank()) viewer = "parent";
        model.addAttribute("viewer", viewer);

        // 2) Collections
        List<RDCollection> collections = safe(() -> collectionService.getCollections());
        model.addAttribute("collections", collections);

        // 3) Featured / trending courses
        List<RDCourse> trendingCourses = safe(() -> courseService.getTrendingCourses());
        model.addAttribute("featuredCourses", trendingCourses);

        // 4) Needs mentors widget
        if ("mentor".equalsIgnoreCase(viewer)) {
            List<RDCourse> needMentors = safe(() -> courseService.getCoursesNeedingMentors());
            model.addAttribute("coursesNeedingMentors", needMentors);
        }

        // 5) Mentor spotlight
        List<RDMentorDTO> teachers = safe(() -> mentorService.getFeaturedMentors());
        model.addAttribute("featuredTeachers", teachers);

        // 6) Upcoming demos
        List<RDDemo> demos = safe(() -> demoService.getUpcomingDemos());
        model.addAttribute("upcomingDemos", demos);

        // 7) Blog posts
        List<RDBlogPost> posts = safe(() -> blogPostService.getBlogPosts());
        model.addAttribute("blogPosts", posts);

        // 8) Testimonials
        if (testimonialService != null) {
            model.addAttribute("testimonials", safe(() -> testimonialService.latest(6)));
        }

        // Echo search query if present
        if (q != null) req.setAttribute("q", q);

        return "home"; // /WEB-INF/views/home.jsp
    }

    // ---------------------------
    // Lead capture → parents demo (prefilled) → thank-you
    // ---------------------------

    @PostMapping("/leads")
    public String captureLead(@ModelAttribute LeadForm form,
                              HttpServletRequest req,
                              Model model) {

        // 1) Light validation
        if (isBlank(form.getName()) || isBlank(form.getPhone()) || isBlank(form.getAudience())) {
            model.addAttribute("error", "Please share your name, WhatsApp number and choose audience.");
            return "redirect:/home#lead";
        }

        // 2) Normalize audience ("parent" | "mentor")
        final String audience = normalizeAudience(form.getAudience());

        // 3) UTM passthrough + extras
        final String utmSource   = nvl(req.getParameter("utm_source"));
        final String utmMedium   = nvl(req.getParameter("utm_medium"));
        final String utmCampaign = nvl(req.getParameter("utm_campaign"));
        final String grade       = nvl(req.getParameter("grade"));
        final String board       = nvl(req.getParameter("board"));

        // 4) Build enriched message (show-only)
        String enrichedMsg = "";
        if (form.getMessage() != null && form.getMessage().length > 0) {
            enrichedMsg = String.join(",", form.getMessage()); // message is String[]
        }
        if (!grade.isEmpty() || !board.isEmpty()) {
            final String gb = "Grade: " + (grade.isEmpty() ? "n/a" : grade) +
                              ", Board: " + (board.isEmpty() ? "n/a" : board);
            enrichedMsg = enrichedMsg.isEmpty() ? gb : (enrichedMsg + " | " + gb);
        }

        // 5) ALWAYS-CREATE capture (NO upsert)
        RDLead saved = null;
        try {
            // IMPORTANT: createLead(...) must unconditionally insert a new row (no findByPhone first)
            saved = leadService.createLead(
                form.getName().trim(),
                sanitizePhone(form.getPhone()),
                nvl(form.getEmail()),
                audience,                     // normalized "parent"/"mentor"
                nvl(form.getSource()),        // e.g., "home_parent_simple"
                utmSource, utmMedium, utmCampaign,
                enrichedMsg,
                grade,
                board
            );
        } catch (Exception ignore) { /* don’t block UX */ }

        // 6) Save lead's subjects (skills) + (if mentor) upsert mentor & mentor skills
        if (saved != null) {
            final String[] rawSubjects = form.getMessage(); // comes from multi-select
            if (rawSubjects != null && rawSubjects.length > 0) {
                // distinct + clean
                java.util.Set<String> subjects = java.util.Arrays.stream(rawSubjects)
                    .filter(s -> s != null && !s.trim().isEmpty())
                    .map(String::trim)
                    .map(this::normalizeSubject) // "math" -> "Math"
                    .collect(java.util.stream.Collectors.toCollection(java.util.LinkedHashSet::new));

                // normalize via rd_skills
                java.util.List<RDSkill> rdSkills = new java.util.ArrayList<>();
                java.util.List<Long>    skillIds = new java.util.ArrayList<>();
                for (String subject : subjects) {
                    RDSkill skill = skillService.getOrCreateSkill(subject); // CI-unique
                    rdSkills.add(skill);
                    skillIds.add(skill.getSkillId());
                }

                // link to rd_lead_skills (idempotent per (lead_id, skill_id))
                leadSkillService.addLeadSkillsIfMissing(saved.getId(), skillIds);

                // if mentor lead: create/update rd_users → rd_mentors → rd_mentor_skills
                if ("mentor".equals(audience)) {
                    mentorService.upsertMentorFromLead(saved, rdSkills);
                    // (Optional) auto-match lead to mentors right now:
                    // leadMentorService.assignLeadToMentors(saved);
                }
            }
        }

        // 7) Fast-path for mentors
        if ("mentor".equals(audience)) {
            return "redirect:/thank-you?audience=mentor&name=" + url(form.getName());
        }

        // 8) Hand off to /parents/demo (prefill)
        final Long leadId = (saved != null ? saved.getId() : null);
        final String subjectsCsv = (form.getMessage() == null ? "" : String.join(",", form.getMessage()));

        final String qp = new StringBuilder()
            .append("prefill=1")
            .append("&leadId=").append(leadId == null ? "" : leadId)
            .append("&audience=").append(url(audience))
            .append("&parentName=").append(url(form.getName()))
            .append("&parentPhone=").append(url(form.getPhone()))
            .append("&parentEmail=").append(url(nvl(form.getEmail())))
            .append("&subjects=").append(url(subjectsCsv))
            .append("&grade=").append(url(grade))
            .append("&board=").append(url(board))
            .append("&source=").append(url(nvl(form.getSource())))
            .append("&utm_source=").append(url(utmSource))
            .append("&utm_medium=").append(url(utmMedium))
            .append("&utm_campaign=").append(url(utmCampaign))
            .toString();

        return "redirect:/parents/demo?" + qp;
    }

    private String normalizeSubject(String s) {
        String t = s.trim().toLowerCase();
        if (t.isEmpty()) return t;
        return Character.toUpperCase(t.charAt(0)) + t.substring(1); // "maths" -> "Maths"
    }

    private static String normalizeAudience(String a) {
        String v = nvl(a).trim().toLowerCase();
        if ("parent".equals(v) || "mentor".equals(v)) return v;
        return "parent"; // default safely
    }

    private static String sanitizePhone(String p) {
        if (p == null) return "";
        String digits = p.replaceAll("\\D", "");
        // India-style normalizations (optional):
        if (digits.startsWith("91") && digits.length() == 12) digits = digits.substring(2);
        if (digits.startsWith("0")  && digits.length() == 11) digits = digits.substring(1);
        return digits.isEmpty() ? p.trim() : digits;
    }

    @GetMapping("/thank-you")
    public String thankYou(@RequestParam(value = "audience", required = false) String audience,
                           @RequestParam(value = "name", required = false) String name,
                           Model model) {
        model.addAttribute("audience", Optional.ofNullable(audience).orElse("parent"));
        model.addAttribute("name", nvl(name));
        return "thank-you"; // /WEB-INF/views/thank-you.jsp
    }

    // ---------------------------
    // Helpers
    // ---------------------------

    private static boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static String url(String s) {
        try {
            return java.net.URLEncoder.encode(nvl(s), "UTF-8");
        } catch (Exception e) {
            return "";
        }
    }

    private static <T> T safe(SupplierX<T> s) {
        try { return s.get(); } catch (Exception e) { return null; }
    }

    @FunctionalInterface
    private interface SupplierX<T> { T get() throws Exception; }

    // ---------------------------
    // Lightweight LeadForm
    // ---------------------------

    public static class LeadForm {
        @NotBlank private String name;
        @NotBlank private String phone;
        @NotBlank private String audience; // "parent" | "mentor"
        private String email;              // optional (now on home.jsp)
        private String grade;
        private String source;             // e.g., "home_parent_simple"
        private String[] message;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAudience() { return audience; }
        public void setAudience(String audience) { this.audience = audience; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public String[] getMessage() { return message; }
        public void setMessage(String[] message) { this.message = message; }
        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }
    }
}
