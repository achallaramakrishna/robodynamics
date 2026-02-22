package com.robodynamics.controller;

import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDCICareerAdjustment;
import com.robodynamics.model.RDCICareerCatalog;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCICareerMappingService;
import com.robodynamics.util.RDRoleRouteUtil;

@Controller
@RequestMapping("/admin/aptipath/career-mapping")
public class RDAdminAptiPathCareerMappingController {

    @Autowired
    private RDCICareerMappingService careerMappingService;

    @GetMapping
    public String dashboard(@RequestParam(value = "module", defaultValue = "APTIPATH") String moduleCode,
                            @RequestParam(value = "version", defaultValue = "v3") String assessmentVersion,
                            @RequestParam(value = "includeInactive", defaultValue = "0") Integer includeInactive,
                            @RequestParam(value = "editCatalogId", required = false) Long editCatalogId,
                            @RequestParam(value = "editAdjustmentId", required = false) Long editAdjustmentId,
                            @RequestParam(value = "saved", required = false) String saved,
                            Model model,
                            HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/aptipath/career-mapping");
        if (redirect != null) {
            return redirect;
        }
        boolean includeInactiveRows = includeInactive != null && includeInactive == 1;
        String module = normalizeModule(moduleCode);
        String version = normalizeVersion(assessmentVersion);

        model.addAttribute("moduleCode", module);
        model.addAttribute("assessmentVersion", version);
        model.addAttribute("includeInactive", includeInactiveRows);
        model.addAttribute("saved", saved == null ? "" : saved);
        model.addAttribute("catalogRows", careerMappingService.getCareerCatalog(module, version, includeInactiveRows));
        model.addAttribute("adjustmentRows", careerMappingService.getAdjustments(module, version, includeInactiveRows));
        model.addAttribute("editCatalog", careerMappingService.getCareerCatalogById(editCatalogId));
        model.addAttribute("editAdjustment", careerMappingService.getCareerAdjustmentById(editAdjustmentId));
        return "admin/aptipath-career-mapping";
    }

    @PostMapping("/catalog/save")
    public String saveCatalog(@RequestParam(value = "ciCareerCatalogId", required = false) Long id,
                              @RequestParam(value = "moduleCode", defaultValue = "APTIPATH") String moduleCode,
                              @RequestParam(value = "assessmentVersion", defaultValue = "v3") String assessmentVersion,
                              @RequestParam(value = "careerCode", required = false) String careerCode,
                              @RequestParam("careerName") String careerName,
                              @RequestParam("clusterName") String clusterName,
                              @RequestParam(value = "fitStrategy", required = false) String fitStrategy,
                              @RequestParam(value = "pathwayHint", required = false) String pathwayHint,
                              @RequestParam(value = "examHint", required = false) String examHint,
                              @RequestParam(value = "prerequisiteSummary", required = false) String prerequisiteSummary,
                              @RequestParam(value = "requiredSubjectsCsv", required = false) String requiredSubjectsCsv,
                              @RequestParam(value = "entranceExamsCsv", required = false) String entranceExamsCsv,
                              @RequestParam(value = "minMathLevel", required = false) Integer minMathLevel,
                              @RequestParam(value = "minPhysicsLevel", required = false) Integer minPhysicsLevel,
                              @RequestParam(value = "minChemistryLevel", required = false) Integer minChemistryLevel,
                              @RequestParam(value = "minBiologyLevel", required = false) Integer minBiologyLevel,
                              @RequestParam(value = "minLanguageLevel", required = false) Integer minLanguageLevel,
                              @RequestParam(value = "targetPhase", required = false) String targetPhase,
                              @RequestParam(value = "sortOrder", required = false) Integer sortOrder,
                              @RequestParam(value = "status", defaultValue = "ACTIVE") String status,
                              HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/aptipath/career-mapping");
        if (redirect != null) {
            return redirect;
        }
        RDCICareerCatalog row = id == null ? new RDCICareerCatalog() : careerMappingService.getCareerCatalogById(id);
        if (row == null) {
            row = new RDCICareerCatalog();
        }
        row.setCiCareerCatalogId(id);
        row.setModuleCode(normalizeModule(moduleCode));
        row.setAssessmentVersion(normalizeVersion(assessmentVersion));
        row.setCareerCode(nz(careerCode).isEmpty() ? autoCareerCode(row, careerName, clusterName) : nz(careerCode).trim().toUpperCase(Locale.ENGLISH));
        row.setCareerName(nz(careerName).trim());
        row.setClusterName(nz(clusterName).trim());
        row.setFitStrategy(nz(fitStrategy).trim().toUpperCase(Locale.ENGLISH));
        row.setPathwayHint(nz(pathwayHint).trim());
        row.setExamHint(nz(examHint).trim());
        row.setPrerequisiteSummary(nz(prerequisiteSummary).trim());
        row.setRequiredSubjectsCsv(nz(requiredSubjectsCsv).trim());
        row.setEntranceExamsCsv(nz(entranceExamsCsv).trim());
        row.setMinMathLevel(clampScale(minMathLevel));
        row.setMinPhysicsLevel(clampScale(minPhysicsLevel));
        row.setMinChemistryLevel(clampScale(minChemistryLevel));
        row.setMinBiologyLevel(clampScale(minBiologyLevel));
        row.setMinLanguageLevel(clampScale(minLanguageLevel));
        row.setTargetPhase(nz(targetPhase).trim().toUpperCase(Locale.ENGLISH));
        row.setSortOrder(sortOrder == null ? 9999 : sortOrder);
        row.setStatus(normalizeStatus(status));
        careerMappingService.saveCareerCatalog(row);
        return redirectWithState(moduleCode, assessmentVersion, 1, "catalog");
    }

    @PostMapping("/catalog/status")
    public String updateCatalogStatus(@RequestParam("ciCareerCatalogId") Long id,
                                      @RequestParam("status") String status,
                                      @RequestParam(value = "moduleCode", defaultValue = "APTIPATH") String moduleCode,
                                      @RequestParam(value = "assessmentVersion", defaultValue = "v3") String assessmentVersion,
                                      @RequestParam(value = "includeInactive", defaultValue = "1") Integer includeInactive,
                                      HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/aptipath/career-mapping");
        if (redirect != null) {
            return redirect;
        }
        careerMappingService.updateCareerCatalogStatus(id, status);
        return redirectWithState(moduleCode, assessmentVersion, includeInactive == null ? 1 : includeInactive, "catalog-status");
    }

    @PostMapping("/adjustment/save")
    public String saveAdjustment(@RequestParam(value = "ciCareerAdjustmentId", required = false) Long id,
                                 @RequestParam(value = "moduleCode", defaultValue = "APTIPATH") String moduleCode,
                                 @RequestParam(value = "assessmentVersion", defaultValue = "v3") String assessmentVersion,
                                 @RequestParam("signalType") String signalType,
                                 @RequestParam("signalCode") String signalCode,
                                 @RequestParam(value = "signalBand", defaultValue = "ANY") String signalBand,
                                 @RequestParam("clusterName") String clusterName,
                                 @RequestParam("boostValue") String boostValue,
                                 @RequestParam(value = "sortOrder", required = false) Integer sortOrder,
                                 @RequestParam(value = "status", defaultValue = "ACTIVE") String status,
                                 HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/aptipath/career-mapping");
        if (redirect != null) {
            return redirect;
        }
        RDCICareerAdjustment row = id == null ? new RDCICareerAdjustment() : careerMappingService.getCareerAdjustmentById(id);
        if (row == null) {
            row = new RDCICareerAdjustment();
        }
        row.setCiCareerAdjustmentId(id);
        row.setModuleCode(normalizeModule(moduleCode));
        row.setAssessmentVersion(normalizeVersion(assessmentVersion));
        row.setSignalType(nz(signalType).trim().toUpperCase(Locale.ENGLISH));
        row.setSignalCode(nz(signalCode).trim().toUpperCase(Locale.ENGLISH));
        row.setSignalBand(nz(signalBand).trim().toUpperCase(Locale.ENGLISH));
        row.setClusterName(nz(clusterName).trim());
        row.setBoostValue(parseDecimal(boostValue));
        row.setSortOrder(sortOrder == null ? 9999 : sortOrder);
        row.setStatus(normalizeStatus(status));
        careerMappingService.saveCareerAdjustment(row);
        return redirectWithState(moduleCode, assessmentVersion, 1, "adjustment");
    }

    @PostMapping("/adjustment/status")
    public String updateAdjustmentStatus(@RequestParam("ciCareerAdjustmentId") Long id,
                                         @RequestParam("status") String status,
                                         @RequestParam(value = "moduleCode", defaultValue = "APTIPATH") String moduleCode,
                                         @RequestParam(value = "assessmentVersion", defaultValue = "v3") String assessmentVersion,
                                         @RequestParam(value = "includeInactive", defaultValue = "1") Integer includeInactive,
                                         HttpSession session) {
        String redirect = ensureAdmin(session, "/admin/aptipath/career-mapping");
        if (redirect != null) {
            return redirect;
        }
        careerMappingService.updateCareerAdjustmentStatus(id, status);
        return redirectWithState(moduleCode, assessmentVersion, includeInactive == null ? 1 : includeInactive, "adjustment-status");
    }

    private String redirectWithState(String moduleCode, String assessmentVersion, Integer includeInactive, String saved) {
        return "redirect:/admin/aptipath/career-mapping?module="
                + urlEncode(normalizeModule(moduleCode))
                + "&version="
                + urlEncode(normalizeVersion(assessmentVersion))
                + "&includeInactive="
                + (includeInactive == null ? 0 : includeInactive)
                + "&saved="
                + urlEncode(nz(saved));
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

    private String normalizeModule(String value) {
        String module = nz(value).trim();
        if (module.isEmpty()) {
            module = "APTIPATH";
        }
        return module.toUpperCase(Locale.ENGLISH);
    }

    private String normalizeVersion(String value) {
        String version = nz(value).trim();
        if (version.isEmpty()) {
            version = "v3";
        }
        return version;
    }

    private String normalizeStatus(String value) {
        String status = nz(value).trim().toUpperCase(Locale.ENGLISH);
        if (!"INACTIVE".equals(status)) {
            return "ACTIVE";
        }
        return status;
    }

    private Integer clampScale(Integer value) {
        if (value == null) {
            return null;
        }
        int v = value;
        if (v < 0) {
            v = 0;
        }
        if (v > 5) {
            v = 5;
        }
        return v;
    }

    private String autoCareerCode(RDCICareerCatalog row, String careerName, String clusterName) {
        if (row != null && row.getCiCareerCatalogId() != null) {
            return "AP3_CAR_EDIT_" + row.getCiCareerCatalogId();
        }
        String name = nz(careerName).trim().toUpperCase(Locale.ENGLISH).replaceAll("[^A-Z0-9]+", "_");
        String cluster = nz(clusterName).trim().toUpperCase(Locale.ENGLISH).replaceAll("[^A-Z0-9]+", "_");
        String prefix = cluster.isEmpty() ? "GEN" : cluster.substring(0, Math.min(cluster.length(), 6));
        String suffix = name.isEmpty() ? "ROLE" : name.substring(0, Math.min(name.length(), 20));
        return (prefix + "_" + suffix).replaceAll("_+", "_");
    }

    private BigDecimal parseDecimal(String value) {
        try {
            return new BigDecimal(nz(value).trim());
        } catch (Exception ex) {
            return BigDecimal.ZERO;
        }
    }

    private String urlEncode(String value) {
        return URLEncoder.encode(nz(value), StandardCharsets.UTF_8);
    }

    private String nz(String value) {
        return value == null ? "" : value;
    }
}
