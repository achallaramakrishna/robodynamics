package com.robodynamics.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDModuleAccessService;

@RestController
@RequestMapping("/module-access/api")
public class RDModuleAccessController {

    @Autowired
    private RDModuleAccessService moduleAccessService;

    @GetMapping("/my-modules")
    public ResponseEntity<?> myModules(HttpSession session) {
        RDUser user = getSessionUser(session);
        if (user == null || user.getUserID() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "UNAUTHORIZED", "message", "Login required."));
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("userId", user.getUserID());
        response.put("profileId", user.getProfile_id());
        response.put("modules", moduleAccessService.getModuleAccessMap(user.getUserID()));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/has")
    public ResponseEntity<?> hasModule(@RequestParam("moduleCode") String moduleCode, HttpSession session) {
        RDUser user = getSessionUser(session);
        if (user == null || user.getUserID() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", "UNAUTHORIZED", "message", "Login required."));
        }
        boolean hasAccess = moduleAccessService.hasModuleAccess(user.getUserID(), moduleCode);
        return ResponseEntity.ok(Map.of(
                "userId", user.getUserID(),
                "moduleCode", moduleCode,
                "hasAccess", hasAccess));
    }

    private RDUser getSessionUser(HttpSession session) {
        Object raw = session.getAttribute("rdUser");
        if (raw instanceof RDUser) {
            return (RDUser) raw;
        }
        return null;
    }
}
