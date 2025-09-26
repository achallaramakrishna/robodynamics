package com.robodynamics.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.model.RDLead;
import com.robodynamics.service.RDLeadMentorService;
import com.robodynamics.service.RDLeadService;


@Controller
@RequestMapping("/leads")
public class RDLeadMentorController {

    @Autowired private RDLeadMentorService leadMentorService;
    
    @Autowired private RDLeadService leadService;

    /** Assign lead to mentors after parent demo request */
    @PostMapping("/assignMentors/{leadId}")
    public String assignMentors(@PathVariable Long leadId) {
        RDLead lead = leadService.getLeadById(leadId);
        leadMentorService.assignLeadToMentors(lead);
        return "redirect:/leads/dashboard";
    }

    /** Mentor claims a lead */
    @PostMapping("/claim/{leadId}/{mentorId}/{skillId}")
    public String claimLead(@PathVariable Long leadId, @PathVariable Long mentorId, @PathVariable Long skillId) {
        leadMentorService.claimLead(leadId, mentorId, skillId);
        return "redirect:/mentors/dashboard";
    }

    /** Mentor proposes alternate demo date */
    @PostMapping("/proposeDate/{leadId}/{mentorId}/{skillId}")
    public String proposeDemoDate(@PathVariable Long leadId,
                                  @PathVariable Long mentorId,
                                  @PathVariable Long skillId,
                                  @RequestParam LocalDateTime newDateTime) {
        leadMentorService.proposeDemoDate(leadId, mentorId, skillId, newDateTime);
        return "redirect:/mentors/dashboard";
    }
}
