package com.robodynamics.service.impl;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.model.RDModule;
import com.robodynamics.model.RDUserPermission;
import com.robodynamics.service.RDCISubscriptionService;
import com.robodynamics.service.RDModuleAccessService;

@Service
public class RDModuleAccessServiceImpl implements RDModuleAccessService {

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private RDCISubscriptionService ciSubscriptionService;

    private Session s() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasModuleAccess(Integer userId, String moduleCode) {
        if (userId == null || moduleCode == null || moduleCode.trim().isEmpty()) {
            return false;
        }
        String code = moduleCode.trim().toUpperCase(Locale.ENGLISH);

        RDUserPermission override = findLatestUserModuleOverride(userId, code);
        if (override != null) {
            if (!"ACTIVE".equalsIgnoreCase(nz(override.getAccessStatus()))) {
                return false;
            }
            if ("DENY".equalsIgnoreCase(nz(override.getFeatureAccess()))) {
                return false;
            }
            return true;
        }

        List<Long> companyIds = s().createQuery(
                "SELECT m.company.companyId FROM RDUserCompanyMap m " +
                        "WHERE m.user.userID = :userId AND m.status = :status",
                Long.class)
                .setParameter("userId", userId)
                .setParameter("status", "ACTIVE")
                .getResultList();

        if (companyIds != null && !companyIds.isEmpty()) {
            Long count = s().createQuery(
                    "SELECT COUNT(cp.companyPermissionId) FROM RDCompanyPermission cp " +
                            "WHERE cp.company.companyId IN (:companyIds) " +
                            "AND cp.module.moduleCode = :moduleCode " +
                            "AND cp.accessStatus = :status " +
                            "AND (cp.expiresAt IS NULL OR cp.expiresAt >= :now)",
                    Long.class)
                    .setParameterList("companyIds", companyIds)
                    .setParameter("moduleCode", code)
                    .setParameter("status", "ACTIVE")
                    .setParameter("now", LocalDateTime.now())
                    .uniqueResult();
            if (count != null && count > 0) {
                return true;
            }
        }

        return ciSubscriptionService.hasActiveModuleSubscription(userId, code);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Boolean> getModuleAccessMap(Integer userId) {
        Map<String, Boolean> map = new LinkedHashMap<>();
        List<RDModule> activeModules = s().createQuery(
                "FROM RDModule m WHERE m.status = :status ORDER BY m.moduleName ASC",
                RDModule.class)
                .setParameter("status", "ACTIVE")
                .getResultList();

        for (RDModule module : activeModules) {
            map.put(module.getModuleCode(), hasModuleAccess(userId, module.getModuleCode()));
        }
        return map;
    }

    private RDUserPermission findLatestUserModuleOverride(Integer userId, String moduleCode) {
        List<RDUserPermission> rows = s().createQuery(
                "FROM RDUserPermission p " +
                        "WHERE p.user.userID = :userId " +
                        "AND p.module.moduleCode = :moduleCode " +
                        "AND p.featureCode IS NULL " +
                        "ORDER BY p.updatedAt DESC",
                RDUserPermission.class)
                .setParameter("userId", userId)
                .setParameter("moduleCode", moduleCode)
                .setMaxResults(1)
                .getResultList();
        return rows.isEmpty() ? null : rows.get(0);
    }

    private String nz(String value) {
        return value == null ? "" : value;
    }
}
