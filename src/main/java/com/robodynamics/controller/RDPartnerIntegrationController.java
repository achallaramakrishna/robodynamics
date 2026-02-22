package com.robodynamics.controller;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.nio.charset.StandardCharsets;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.UriUtils;

import com.robodynamics.model.RDCompany;
import com.robodynamics.model.RDCompanyBranding;
import com.robodynamics.model.RDCompanySsoConfig;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCompanyContextService;
import com.robodynamics.service.RDModuleAccessService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.util.RDHmacUtil;
import com.robodynamics.util.RDRoleRouteUtil;

@Controller
public class RDPartnerIntegrationController {

    @Autowired
    private RDCompanyContextService companyContextService;

    @Autowired
    private RDUserService userService;

    @Autowired
    private RDModuleAccessService moduleAccessService;

    @Value("${rd.integration.default.shared.secret:rd_integration_default_secret_change_me}")
    private String defaultSharedSecret;

    @Value("${rd.integration.default.ttl.seconds:300}")
    private int defaultTtlSeconds;

    @RequestMapping("/integrations/launch")
    public String launch(@RequestParam("company") String companyCode,
                         @RequestParam("module") String moduleCode,
                         @RequestParam("userId") Integer userId,
                         @RequestParam("ts") Long ts,
                         @RequestParam("sig") String sig,
                         @RequestParam(value = "target", required = false) String target,
                         @RequestParam(value = "embed", defaultValue = "1") Integer embed,
                         HttpSession session,
                         Model model) {

        RDCompany company = companyContextService.getActiveCompanyByCode(companyCode);
        if (company == null) {
            model.addAttribute("error", "Invalid company.");
            return "error/403";
        }

        RDCompanySsoConfig ssoConfig = companyContextService.getActiveSsoConfigByCompanyCode(companyCode);
        String sharedSecret = resolveSharedSecret(ssoConfig);
        int ttlSeconds = resolveTtlSeconds(ssoConfig);

        if (!isFreshTimestamp(ts, ttlSeconds)) {
            model.addAttribute("error", "Launch token expired.");
            return "error/403";
        }

        String normalizedModule = normalizeModule(moduleCode);
        String payload = company.getCompanyCode() + "|" + normalizedModule + "|" + userId + "|" + ts;
        String expectedSig = RDHmacUtil.hmacSha256Hex(payload, sharedSecret);
        if (!RDHmacUtil.constantTimeEquals(expectedSig, safeTrim(sig))) {
            model.addAttribute("error", "Invalid launch token signature.");
            return "error/403";
        }

        RDUser user = userService.getRDUser(userId);
        if (user == null || user.getUserID() == null) {
            model.addAttribute("error", "Invalid user.");
            return "error/403";
        }

        if (!moduleAccessService.hasModuleAccess(user.getUserID(), normalizedModule)) {
            model.addAttribute("error", "Module access denied.");
            return "error/403";
        }

        session.setAttribute("rdUser", user);
        session.setAttribute("tenantCompanyCode", company.getCompanyCode());
        session.setAttribute("tenantCompanyId", company.getCompanyId());
        session.setAttribute("embedMode", embed != null && embed == 1);

        String redirectPath = resolveTargetPath(normalizedModule, target);
        String redirect = redirectPath
                + (redirectPath.contains("?") ? "&" : "?")
                + "embed=1&company=" + UriUtils.encode(company.getCompanyCode(), StandardCharsets.UTF_8);
        return "redirect:" + redirect;
    }

    @GetMapping("/platform/modules")
    public String modules(@RequestParam(value = "company", required = false) String companyCode,
                          @RequestParam(value = "embed", defaultValue = "0") Integer embed,
                          HttpSession session,
                          Model model) {

        RDUser user = getSessionUser(session);
        if (user == null || user.getUserID() == null) {
            return "redirect:/login?redirect=/platform/modules";
        }

        String resolvedCompanyCode = resolveCompanyCode(companyCode, session);
        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);
        Map<String, Boolean> modules = moduleAccessService.getModuleAccessMap(user.getUserID());
        boolean aptiPathRegistrationRequired = requiresParentChildRegistrationForAptiPath(user);

        model.addAttribute("rdUser", user);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("branding", branding);
        model.addAttribute("embedMode", embed != null && embed == 1);
        model.addAttribute("moduleAccess", modules);
        model.addAttribute("moduleUrls", buildModuleUrls(modules, resolvedCompanyCode, embed, user));
        model.addAttribute("aptiPathRegistrationRequired", aptiPathRegistrationRequired);
        model.addAttribute("aptiPathActivationUrl", buildAptiPathActivationUrl(aptiPathRegistrationRequired));
        return "integrations/module-hub";
    }

    private Map<String, String> buildModuleUrls(Map<String, Boolean> modules, String companyCode, Integer embed, RDUser user) {
        Map<String, String> links = new LinkedHashMap<>();
        int profileId = user == null ? -1 : user.getProfile_id();
        boolean parent = profileId == RDUser.profileType.ROBO_PARENT.getValue();
        boolean student = profileId == RDUser.profileType.ROBO_STUDENT.getValue();
        if (modules.containsKey("APTIPATH")) {
            if (parent) {
                links.put("APTIPATH", "/aptipath/parent/home?embed=" + (embed != null && embed == 1 ? "1" : "0")
                        + "&company=" + safeTrim(companyCode));
            } else if (student) {
                links.put("APTIPATH", "/aptipath/student/home?embed=" + (embed != null && embed == 1 ? "1" : "0")
                        + "&company=" + safeTrim(companyCode));
            } else {
                links.put("APTIPATH", "/platform/modules");
            }
        }
        if (modules.containsKey("EXAM_PREP")) {
            if (student) {
                links.put("EXAM_PREP", "/studentDashboard");
            } else if (parent) {
                links.put("EXAM_PREP", "/parent/dashboard");
            } else {
                links.put("EXAM_PREP", RDRoleRouteUtil.homePathFor(user));
            }
        }
        if (modules.containsKey("COURSE")) {
            if (student) {
                links.put("COURSE", "/studentDashboard");
            } else if (parent) {
                links.put("COURSE", "/parent/dashboard");
            } else {
                links.put("COURSE", RDRoleRouteUtil.homePathFor(user));
            }
        }
        return links;
    }

    private RDUser getSessionUser(HttpSession session) {
        Object raw = session.getAttribute("rdUser");
        if (raw instanceof RDUser) {
            return (RDUser) raw;
        }
        return null;
    }

    private String resolveCompanyCode(String companyCode, HttpSession session) {
        String incoming = safeTrim(companyCode);
        if (!incoming.isEmpty()) {
            return incoming;
        }
        Object raw = session.getAttribute("tenantCompanyCode");
        if (raw instanceof String) {
            return safeTrim((String) raw);
        }
        return "ROBODYNAMICS";
    }

    private String resolveTargetPath(String moduleCode, String target) {
        String t = safeTrim(target);
        if (!t.isEmpty() && t.startsWith("/")) {
            return t;
        }
        switch (moduleCode) {
            case "APTIPATH":
                return "/platform/modules";
            case "EXAM_PREP":
                return "/platform/modules";
            case "COURSE":
                return "/platform/modules";
            default:
                return "/platform/modules";
        }
    }

    private String normalizeModule(String moduleCode) {
        if (moduleCode == null) {
            return "";
        }
        return moduleCode.trim().toUpperCase(Locale.ENGLISH);
    }

    private String resolveSharedSecret(RDCompanySsoConfig ssoConfig) {
        if (ssoConfig != null && !safeTrim(ssoConfig.getSharedSecret()).isEmpty()) {
            return ssoConfig.getSharedSecret().trim();
        }
        return defaultSharedSecret;
    }

    private int resolveTtlSeconds(RDCompanySsoConfig ssoConfig) {
        if (ssoConfig != null && ssoConfig.getTokenTtlSeconds() != null && ssoConfig.getTokenTtlSeconds() > 0) {
            return ssoConfig.getTokenTtlSeconds();
        }
        return defaultTtlSeconds;
    }

    private boolean isFreshTimestamp(Long ts, int ttlSeconds) {
        if (ts == null || ttlSeconds <= 0) {
            return false;
        }
        long now = Instant.now().getEpochSecond();
        long diff = Math.abs(now - ts);
        return diff <= ttlSeconds;
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }

    private boolean requiresParentChildRegistrationForAptiPath(RDUser user) {
        if (user == null || user.getUserID() == null) {
            return true;
        }
        int profileId = user.getProfile_id();
        if (profileId == RDUser.profileType.ROBO_PARENT.getValue()) {
            List<RDUser> children = userService.getRDChilds(user.getUserID());
            return children == null || children.isEmpty();
        }
        if (profileId == RDUser.profileType.ROBO_STUDENT.getValue()) {
            return (user.getMom() == null || user.getMom().getUserID() == null)
                    && (user.getDad() == null || user.getDad().getUserID() == null);
        }
        return true;
    }

    private String buildAptiPathActivationUrl(boolean registrationRequired) {
        String checkoutPath = "/plans/checkout?plan=career-premium";
        if (!registrationRequired) {
            return checkoutPath;
        }
        return "/registerParentChild?plan=career-premium&redirect="
                + UriUtils.encode(checkoutPath, StandardCharsets.UTF_8);
    }
}
