package com.robodynamics.util;

import com.robodynamics.model.RDUser;

/**
 * Centralized role-to-home routing for consistent redirects across controllers.
 */
public final class RDRoleRouteUtil {

    private RDRoleRouteUtil() {
        // Utility class
    }

    public static String homePathFor(RDUser user) {
        if (user == null) {
            return "/login";
        }

        int profileId = user.getProfile_id();
        if (profileId == RDUser.profileType.SUPER_ADMIN.getValue()
                || profileId == RDUser.profileType.ROBO_ADMIN.getValue()) {
            return "/dashboard";
        }
        if (profileId == RDUser.profileType.ROBO_MENTOR.getValue()) {
            return "/mentor/dashboard";
        }
        if (profileId == RDUser.profileType.ROBO_PARENT.getValue()
                || profileId == RDUser.profileType.ROBO_STUDENT.getValue()) {
            return "/platform/modules";
        }
        if (profileId == RDUser.profileType.ROBO_FINANCE_ADMIN.getValue()) {
            return "/finance/dashboard";
        }
        if (profileId == RDUser.profileType.COMPANY_ADMIN.getValue()) {
            return "/company-admin/dashboard";
        }
        return "/platform/modules";
    }

    public static String redirectHomeFor(RDUser user) {
        return "redirect:" + homePathFor(user);
    }

    public static boolean isAdminProfile(Integer profileId) {
        if (profileId == null) {
            return false;
        }
        return profileId == RDUser.profileType.SUPER_ADMIN.getValue()
                || profileId == RDUser.profileType.ROBO_ADMIN.getValue();
    }

    public static boolean isCompanyAdminProfile(Integer profileId) {
        if (profileId == null) {
            return false;
        }
        return profileId == RDUser.profileType.COMPANY_ADMIN.getValue();
    }
}
