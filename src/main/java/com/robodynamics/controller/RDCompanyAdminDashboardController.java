package com.robodynamics.controller;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.robodynamics.model.RDCompany;
import com.robodynamics.model.RDCompanyBranding;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCompanyContextService;
import com.robodynamics.service.RDModuleAccessService;
import com.robodynamics.util.RDRoleRouteUtil;

@Controller
public class RDCompanyAdminDashboardController {

    @Autowired
    private RDCompanyContextService companyContextService;

    @Autowired
    private RDModuleAccessService moduleAccessService;

    @GetMapping("/company-admin/dashboard")
    public String dashboard(HttpSession session, Model model) {
        Object rawUser = session.getAttribute("rdUser");
        if (!(rawUser instanceof RDUser)) {
            return "redirect:/login?redirect=/company-admin/dashboard";
        }

        RDUser user = (RDUser) rawUser;
        if (user.getProfile_id() != RDUser.profileType.COMPANY_ADMIN.getValue()) {
            return RDRoleRouteUtil.redirectHomeFor(user);
        }

        String resolvedCompanyCode = resolveCompanyCode(session);
        RDCompany company = companyContextService.getActiveCompanyByCode(resolvedCompanyCode);
        if (company == null && !"ROBODYNAMICS".equalsIgnoreCase(resolvedCompanyCode)) {
            resolvedCompanyCode = "ROBODYNAMICS";
            company = companyContextService.getActiveCompanyByCode(resolvedCompanyCode);
        }

        RDCompanyBranding branding = companyContextService.getActiveBrandingByCompanyCode(resolvedCompanyCode);
        Map<String, Boolean> moduleAccess = moduleAccessService.getModuleAccessMap(user.getUserID());

        model.addAttribute("rdUser", user);
        model.addAttribute("companyCode", resolvedCompanyCode);
        model.addAttribute("company", company);
        model.addAttribute("branding", branding);
        model.addAttribute("moduleAccess", moduleAccess);
        return "company-admin/dashboard";
    }

    @GetMapping("/company/dashboard")
    public String dashboardAlias() {
        return "redirect:/company-admin/dashboard";
    }

    private String resolveCompanyCode(HttpSession session) {
        Object raw = session.getAttribute("tenantCompanyCode");
        if (raw instanceof String && !((String) raw).trim().isEmpty()) {
            return ((String) raw).trim();
        }
        return "ROBODYNAMICS";
    }
}
