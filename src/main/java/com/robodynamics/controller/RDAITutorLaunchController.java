package com.robodynamics.controller;

import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDUserService;
import com.robodynamics.service.impl.RDAITutorIntegrationService;

@Controller
public class RDAITutorLaunchController {

    @Autowired
    private RDAITutorIntegrationService aiTutorIntegrationService;

    @Autowired
    private RDUserService rdUserService;

    @GetMapping("/ai-tutor/launch")
    public String launch(@RequestParam(value = "module", required = false, defaultValue = "VEDIC_MATH") String module,
                         @RequestParam(value = "grade", required = false) String grade,
                         @RequestParam(value = "childId", required = false) Integer childId,
                         HttpSession session) {
        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) {
            return "redirect:/login?redirect=/ai-tutor/launch";
        }

        Integer effectiveChildId = childId;
        if (me.getProfile_id() == RDUser.profileType.ROBO_STUDENT.getValue()) {
            effectiveChildId = me.getUserID();
        } else if (effectiveChildId == null) {
            List<RDUser> children = rdUserService.getRDChilds(me.getUserID());
            if (children != null && !children.isEmpty()) {
                effectiveChildId = children.get(0).getUserID();
            }
        }

        String token = aiTutorIntegrationService.createLaunchToken(me, effectiveChildId, module, grade);
        String launchUrl = aiTutorIntegrationService.buildLaunchUrl(token);
        return "redirect:" + launchUrl;
    }
}

