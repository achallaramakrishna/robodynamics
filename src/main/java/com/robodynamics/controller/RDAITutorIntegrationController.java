package com.robodynamics.controller;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.robodynamics.dto.RDAITutorEventRequest;
import com.robodynamics.dto.RDAITutorSessionInitRequest;
import com.robodynamics.dto.RDAITutorSessionInitResponse;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDUserService;
import com.robodynamics.service.impl.RDAITutorIntegrationService;

@RestController
@RequestMapping("/api/ai-tutor")
public class RDAITutorIntegrationController {

    @Autowired
    private RDAITutorIntegrationService aiTutorIntegrationService;

    @Autowired
    private RDUserService rdUserService;

    @PostMapping("/session/init")
    public ResponseEntity<?> initSession(@RequestBody(required = false) RDAITutorSessionInitRequest request,
                                         HttpSession session) {
        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not signed in"));
        }

        RDAITutorSessionInitRequest resolved = request == null ? new RDAITutorSessionInitRequest() : request;
        Integer childId = resolveChildId(me, resolved.getChildId());
        if (isParent(me) && childId == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "childId is required for parent launch when no child is linked."
            ));
        }

        String token = aiTutorIntegrationService.createLaunchToken(
                me,
                childId,
                resolved.getModule(),
                resolved.getGrade()
        );
        RDAITutorSessionInitResponse response = new RDAITutorSessionInitResponse();
        response.setLaunchUrl(aiTutorIntegrationService.buildLaunchUrl(token));
        response.setExpiresInSec(aiTutorIntegrationService.getTokenTtlSeconds());
        response.setModule(resolved.getModule() == null ? "VEDIC_MATH" : resolved.getModule());
        response.setGrade(resolved.getGrade() == null ? safeGrade(me) : resolved.getGrade());
        response.setChildId(childId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/session/event")
    public ResponseEntity<?> receiveEvent(@RequestBody RDAITutorEventRequest request,
                                          @RequestHeader(value = "X-AI-TUTOR-KEY", required = false) String apiKey) {
        if (!aiTutorIntegrationService.isValidInternalApiKey(apiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid AI tutor API key"));
        }
        if (request == null || request.getSessionId() == null || request.getSessionId().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "sessionId is required"));
        }
        aiTutorIntegrationService.recordEvent(request);
        return ResponseEntity.ok(Map.of("status", "ok"));
    }

    @GetMapping("/session/summary")
    public ResponseEntity<?> summary(@RequestParam(value = "childId", required = false) Integer childId,
                                     @RequestParam(value = "module", required = false, defaultValue = "VEDIC_MATH") String module,
                                     @RequestParam(value = "recentLimit", required = false, defaultValue = "15") int recentLimit,
                                     HttpSession session) {
        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not signed in"));
        }

        Integer effectiveChildId = resolveSummaryChild(me, childId);
        Map<String, Object> summary = aiTutorIntegrationService.getSummary(effectiveChildId, module);
        List<RDAITutorEventRequest> recent = aiTutorIntegrationService.getRecentEvents(
                effectiveChildId,
                module,
                recentLimit
        );

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("summary", summary);
        out.put("recentEvents", recent);
        return ResponseEntity.ok(out);
    }

    private Integer resolveChildId(RDUser me, Integer requestedChildId) {
        if (isStudent(me)) {
            return me.getUserID();
        }
        List<RDUser> children = rdUserService.getRDChilds(me.getUserID());
        if (children == null || children.isEmpty()) {
            return requestedChildId;
        }

        if (requestedChildId != null) {
            Set<Integer> allowed = children.stream()
                    .map(RDUser::getUserID)
                    .collect(Collectors.toSet());
            if (!allowed.contains(requestedChildId)) {
                return null;
            }
            return requestedChildId;
        }
        return children.get(0).getUserID();
    }

    private Integer resolveSummaryChild(RDUser me, Integer requestedChildId) {
        if (isStudent(me)) {
            return me.getUserID();
        }
        if (requestedChildId == null) {
            List<RDUser> children = rdUserService.getRDChilds(me.getUserID());
            if (children == null || children.isEmpty()) {
                return null;
            }
            return children.get(0).getUserID();
        }
        List<RDUser> children = rdUserService.getRDChilds(me.getUserID());
        if (children == null || children.isEmpty()) {
            return null;
        }
        Set<Integer> allowed = children.stream().map(RDUser::getUserID).collect(Collectors.toSet());
        return allowed.contains(requestedChildId) ? requestedChildId : null;
    }

    private static boolean isParent(RDUser user) {
        return user != null && user.getProfile_id() == RDUser.profileType.ROBO_PARENT.getValue();
    }

    private static boolean isStudent(RDUser user) {
        return user != null && user.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue();
    }

    private static String safeGrade(RDUser user) {
        if (user == null || user.getGrade() == null || user.getGrade().isBlank()) {
            return "6";
        }
        return user.getGrade();
    }
}

