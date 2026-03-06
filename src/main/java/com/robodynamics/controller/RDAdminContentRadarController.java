package com.robodynamics.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDContentRadarItem;
import com.robodynamics.model.RDContentRadarSource;
import com.robodynamics.model.RDNewsletterIssue;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDContentRadarService;
import com.robodynamics.util.RDRoleRouteUtil;

@Controller
@RequestMapping("/admin/content-radar")
public class RDAdminContentRadarController {

    private static final List<String> ITEM_STATUSES = Arrays.asList(
            "ALL", "DISCOVERED", "REVIEW", "APPROVED", "DRAFTED", "PUBLISHED", "REJECTED"
    );

    @Autowired
    private RDContentRadarService contentRadarService;

    @GetMapping
    public String dashboard(@RequestParam(value = "status", required = false) String status,
                            @RequestParam(value = "saved", required = false) String saved,
                            @RequestParam(value = "sourceEditId", required = false) Long sourceEditId,
                            @RequestParam(value = "issueEditId", required = false) Long issueEditId,
                            @RequestParam(value = "weekStart", required = false) String weekStart,
                            Model model,
                            HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }

        String normalizedStatus = normalizeStatus(status);
        LocalDate selectedWeekStart = parseWeekStartOrDefault(weekStart);
        RDContentRadarSource sourceForm = resolveSourceForm(sourceEditId);
        RDNewsletterIssue issueForm = resolveIssueForm(issueEditId, selectedWeekStart);
        List<RDContentRadarSource> sources = contentRadarService.getAllSources();
        List<RDContentRadarItem> items = contentRadarService.getLatestItems(normalizedStatus, 120);
        List<RDNewsletterIssue> issues = contentRadarService.getLatestNewsletterIssues(20);

        model.addAttribute("saved", nz(saved));
        model.addAttribute("message", resolveMessage(saved));
        model.addAttribute("selectedStatus", normalizedStatus);
        model.addAttribute("itemStatuses", ITEM_STATUSES);
        model.addAttribute("weekStart", selectedWeekStart);
        model.addAttribute("sources", sources);
        model.addAttribute("sourceForm", sourceForm);
        model.addAttribute("items", items);
        model.addAttribute("issues", issues);
        model.addAttribute("issueForm", issueForm);
        return "admin/content-radar";
    }

    @PostMapping("/source/save")
    public String saveSource(@RequestParam(value = "sourceId", required = false) Long sourceId,
                             @RequestParam("sourceName") String sourceName,
                             @RequestParam(value = "sourceType", required = false) String sourceType,
                             @RequestParam("feedUrl") String feedUrl,
                             @RequestParam(value = "baseUrl", required = false) String baseUrl,
                             @RequestParam(value = "authorityWeight", required = false) Integer authorityWeight,
                             @RequestParam(value = "active", required = false) Integer active,
                             @RequestParam(value = "notes", required = false) String notes,
                             HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }
        RDContentRadarSource source = findSourceById(sourceId);
        if (source == null) {
            source = new RDContentRadarSource();
            source.setSourceId(sourceId);
        }
        source.setSourceName(nz(sourceName).trim());
        source.setSourceType(nz(sourceType).trim().isEmpty() ? "RSS" : sourceType.trim());
        source.setFeedUrl(nz(feedUrl).trim());
        source.setBaseUrl(nz(baseUrl).trim());
        source.setAuthorityWeight(authorityWeight == null ? 70 : authorityWeight);
        source.setActive(active != null && active == 1);
        source.setNotes(nz(notes).trim());
        contentRadarService.saveSource(source);
        return "redirect:/admin/content-radar?saved=source_saved";
    }

    @PostMapping("/source/delete")
    public String deleteSource(@RequestParam("sourceId") Long sourceId,
                               HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }
        contentRadarService.deleteSource(sourceId);
        return "redirect:/admin/content-radar?saved=source_deleted";
    }

    @PostMapping("/refresh")
    public String refreshNow(HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }
        int upserts = contentRadarService.refreshFromActiveSources();
        return "redirect:/admin/content-radar?saved=" + urlEncode("refreshed_" + upserts);
    }

    @PostMapping("/item/status")
    public String updateItemStatus(@RequestParam("itemId") Long itemId,
                                   @RequestParam("status") String status,
                                   @RequestParam(value = "editorNotes", required = false) String editorNotes,
                                   HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }
        contentRadarService.updateItemStatus(itemId, status, editorNotes);
        return "redirect:/admin/content-radar?saved=item_status";
    }

    @PostMapping("/item/draft")
    public String buildItemDraft(@RequestParam("itemId") Long itemId,
                                 HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }
        contentRadarService.buildDraftFromItem(itemId);
        return "redirect:/admin/content-radar?saved=item_drafted";
    }

    @PostMapping("/item/publish")
    public String publishItem(@RequestParam("itemId") Long itemId,
                              @RequestParam(value = "publishNow", required = false) Integer publishNow,
                              HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }
        contentRadarService.publishItemToAwareness(itemId, publishNow == null || publishNow == 1);
        return "redirect:/admin/content-radar?saved=item_published";
    }

    @PostMapping("/newsletter/generate")
    public String generateNewsletter(@RequestParam(value = "weekStart", required = false) String weekStart,
                                     HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }
        LocalDate selectedWeekStart = parseWeekStartOrDefault(weekStart);
        RDNewsletterIssue issue = contentRadarService.generateWeeklyNewsletterDraft(selectedWeekStart);
        if (issue == null || issue.getIssueId() == null) {
            return "redirect:/admin/content-radar?saved=newsletter_error";
        }
        return "redirect:/admin/content-radar?saved=newsletter_generated&issueEditId=" + issue.getIssueId();
    }

    @PostMapping("/newsletter/save")
    public String saveNewsletter(@RequestParam("issueId") Long issueId,
                                 @RequestParam("title") String title,
                                 @RequestParam("subjectLine") String subjectLine,
                                 @RequestParam(value = "bodyHtml", required = false) String bodyHtml,
                                 @RequestParam(value = "status", required = false) String status,
                                 HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }
        RDNewsletterIssue issue = contentRadarService.getNewsletterIssue(issueId);
        if (issue == null) {
            return "redirect:/admin/content-radar?saved=newsletter_missing";
        }
        issue.setTitle(nz(title).trim());
        issue.setSubjectLine(nz(subjectLine).trim());
        issue.setBodyHtml(nz(bodyHtml));
        issue.setStatus(nz(status).trim().isEmpty() ? issue.getStatus() : status.trim().toUpperCase(Locale.ENGLISH));
        contentRadarService.saveNewsletterIssue(issue);
        return "redirect:/admin/content-radar?saved=newsletter_saved&issueEditId=" + issue.getIssueId();
    }

    @PostMapping("/newsletter/publish")
    public String publishNewsletter(@RequestParam("issueId") Long issueId,
                                    HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/content-radar");
        if (redirect != null) {
            return redirect;
        }
        contentRadarService.publishNewsletterToAwareness(issueId);
        return "redirect:/admin/content-radar?saved=newsletter_published&issueEditId=" + issueId;
    }

    private RDContentRadarSource resolveSourceForm(Long sourceEditId) {
        if (sourceEditId == null || sourceEditId <= 0) {
            RDContentRadarSource source = new RDContentRadarSource();
            source.setActive(Boolean.TRUE);
            source.setAuthorityWeight(70);
            source.setSourceType("RSS");
            return source;
        }
        RDContentRadarSource source = findSourceById(sourceEditId);
        if (source != null) {
            return source;
        }
        RDContentRadarSource fallback = new RDContentRadarSource();
        fallback.setActive(Boolean.TRUE);
        fallback.setAuthorityWeight(70);
        fallback.setSourceType("RSS");
        return fallback;
    }

    private RDContentRadarSource findSourceById(Long sourceId) {
        if (sourceId == null || sourceId <= 0) {
            return null;
        }
        for (RDContentRadarSource source : contentRadarService.getAllSources()) {
            if (source != null && sourceId.equals(source.getSourceId())) {
                return source;
            }
        }
        return null;
    }

    private RDNewsletterIssue resolveIssueForm(Long issueEditId, LocalDate weekStart) {
        if (issueEditId == null || issueEditId <= 0) {
            RDNewsletterIssue issue = new RDNewsletterIssue();
            issue.setWeekStart(weekStart);
            issue.setWeekEnd(weekStart.plusDays(6));
            issue.setStatus("DRAFT");
            return issue;
        }
        RDNewsletterIssue issue = contentRadarService.getNewsletterIssue(issueEditId);
        if (issue == null) {
            RDNewsletterIssue fallback = new RDNewsletterIssue();
            fallback.setWeekStart(weekStart);
            fallback.setWeekEnd(weekStart.plusDays(6));
            fallback.setStatus("DRAFT");
            return fallback;
        }
        return issue;
    }

    private String resolveMessage(String saved) {
        String key = nz(saved).trim();
        if (key.isEmpty()) {
            return "";
        }
        if (key.startsWith("refreshed_")) {
            return "Feed refresh completed. Upserts: " + key.replace("refreshed_", "");
        }
        if ("source_saved".equals(key)) {
            return "Source saved successfully.";
        }
        if ("source_deleted".equals(key)) {
            return "Source deleted.";
        }
        if ("item_status".equals(key)) {
            return "Item status updated.";
        }
        if ("item_drafted".equals(key)) {
            return "Draft generated from source item.";
        }
        if ("item_published".equals(key)) {
            return "Item published to home awareness feed with source link.";
        }
        if ("newsletter_generated".equals(key)) {
            return "Weekly newsletter draft generated.";
        }
        if ("newsletter_saved".equals(key)) {
            return "Newsletter draft updated.";
        }
        if ("newsletter_published".equals(key)) {
            return "Newsletter published to awareness feed.";
        }
        if ("newsletter_missing".equals(key)) {
            return "Requested newsletter draft was not found.";
        }
        if ("newsletter_error".equals(key)) {
            return "Unable to generate newsletter draft.";
        }
        return "Action completed.";
    }

    private String normalizeStatus(String status) {
        String normalized = nz(status).trim().toUpperCase(Locale.ENGLISH);
        if (normalized.isEmpty() || !ITEM_STATUSES.contains(normalized)) {
            return "ALL";
        }
        return normalized;
    }

    private LocalDate parseWeekStartOrDefault(String weekStart) {
        if (weekStart != null) {
            try {
                return LocalDate.parse(weekStart.trim()).with(DayOfWeek.MONDAY);
            } catch (DateTimeParseException ignored) {
            }
        }
        return LocalDate.now().with(DayOfWeek.MONDAY);
    }

    private String ensureAdmin(HttpSession session, String path) {
        Object raw = session.getAttribute("rdUser");
        if (!(raw instanceof RDUser)) {
            return "redirect:/login?redirect=" + urlEncode(path);
        }
        RDUser user = (RDUser) raw;
        if (!isAdmin(user)) {
            return RDRoleRouteUtil.redirectHomeFor(user);
        }
        return null;
    }

    private boolean isAdmin(RDUser user) {
        if (user == null) {
            return false;
        }
        int profile = user.getProfile_id();
        return profile == RDUser.profileType.SUPER_ADMIN.getValue()
                || profile == RDUser.profileType.ROBO_ADMIN.getValue()
                || profile == RDUser.profileType.COMPANY_ADMIN.getValue();
    }

    private String nz(String value) {
        return value == null ? "" : value;
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(nz(value), StandardCharsets.UTF_8);
    }
}
