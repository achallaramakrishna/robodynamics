package com.robodynamics.controller;

import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMentorAssignment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDLeadMentorService;
import com.robodynamics.service.RDLeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/leads")
public class RDLeadController {

    @Autowired
    private RDLeadService leadService;

    @Autowired
    private RDLeadMentorService leadMentorService;

    /** Leads Dashboard: Admin sees all, Mentor sees assigned only */
    @GetMapping("/dashboard")
    public String viewLeadsDashboard(HttpSession session, Model model) {
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        List<RDLead> leads;

        if (currentUser != null && currentUser.getProfile_id() == 3) { // Mentor
            leads = leadMentorService.getLeadsForMentor(currentUser.getUserID());
            model.addAttribute("isMentor", true);
        } else { // Admin or others
            leads = leadService.getAllLeads();
            model.addAttribute("isAdmin", true);
        }

        model.addAttribute("leads", leads);
        return "leads_dashboard";
    }

    /** View a single lead with mentor assignments */
    // View a single lead
    @GetMapping("/view/{id}")
    public String viewLead(@PathVariable("id") Long leadId,
                           HttpSession session,
                           Model model) {
        RDLead lead = leadService.getLeadById(leadId);
        model.addAttribute("lead", lead);

        // Fetch all assignments
        List<RDMentorAssignment> assignments = leadMentorService.getAssignmentsForLead(leadId);

        // Check if current user is a mentor
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        if (currentUser != null && currentUser.getProfile_id() == 3) {
            // Filter assignments to only those assigned to this mentor
            assignments = assignments.stream()
                    .filter(a -> a.getMentor().getUserID() == currentUser.getUserID())
                    .collect(Collectors.toList());
        }

        model.addAttribute("mentorAssignments", assignments);

        return "lead_view"; // JSP page
    }

    /** Edit an existing lead (Admin only) */
    @GetMapping("/edit/{id}")
    public String editLead(@PathVariable("id") Long leadId, HttpSession session, Model model) {
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        if (currentUser == null || currentUser.getProfile_id() != 1) { // Only admin
            return "redirect:/leads/dashboard";
        }

        RDLead lead = leadService.getLeadById(leadId);
        model.addAttribute("lead", lead);
        return "lead_edit";
    }

    /** Update the lead after editing (Admin only) */
    @PostMapping("/update/{id}")
    public String updateLead(@PathVariable("id") Long leadId, @ModelAttribute RDLead lead, HttpSession session) {
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        if (currentUser == null || currentUser.getProfile_id() != 1) {
            return "redirect:/leads/dashboard";
        }

        lead.setId(leadId);
        leadService.saveOrUpdateLead(lead);
        return "redirect:/leads/dashboard";
    }

    /** Delete a lead (Admin only) */
    @GetMapping("/delete/{id}")
    public String deleteLead(@PathVariable("id") Long leadId, HttpSession session) {
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        if (currentUser == null || currentUser.getProfile_id() != 1) {
            return "redirect:/leads/dashboard";
        }

        leadService.deleteLead(leadId);
        return "redirect:/leads/dashboard";
    }
}
