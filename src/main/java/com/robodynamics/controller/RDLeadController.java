package com.robodynamics.controller;

import com.robodynamics.model.RDLead;
import com.robodynamics.service.RDLeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/leads")
public class RDLeadController {

    @Autowired
    private RDLeadService leadService;

    // Display the Leads Dashboard
    @GetMapping("/dashboard")
    public String viewLeadsDashboard(Model model) {
        List<RDLead> leads = leadService.getAllLeads();
        model.addAttribute("leads", leads); // Add the leads list to the model
        return "leads_dashboard"; // This refers to the JSP page for the leads dashboard
    }

    // View a single lead
    @GetMapping("/view/{id}")
    public String viewLead(@PathVariable("id") Long leadId, Model model) {
        RDLead lead = leadService.getLeadById(leadId);
        model.addAttribute("lead", lead);
        return "lead_view"; // JSP page to display the details of the lead
    }

    // Edit an existing lead
    @GetMapping("/edit/{id}")
    public String editLead(@PathVariable("id") Long leadId, Model model) {
        RDLead lead = leadService.getLeadById(leadId);
        model.addAttribute("lead", lead);
        return "lead_edit"; // JSP page for editing lead details
    }

    // Update the lead after editing
    @PostMapping("/update/{id}")
    public String updateLead(@PathVariable("id") Long leadId, @ModelAttribute RDLead lead) {
        lead.setId(leadId); // Set the lead ID to update the correct record
        leadService.saveOrUpdateLead(lead); // Save or update the lead
        return "redirect:/leads/dashboard"; // Redirect back to the dashboard after updating
    }

    // Delete a lead
    @GetMapping("/delete/{id}")
    public String deleteLead(@PathVariable("id") Long leadId) {
        leadService.deleteLead(leadId); // Delete the lead from the database
        return "redirect:/leads/dashboard"; // Redirect back to the leads dashboard after deletion
    }
}
