package com.robodynamics.controller;

import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDMentorAssignment;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDSkill;
import com.robodynamics.service.RDLeadMentorService;
import com.robodynamics.service.RDLeadService;
import com.robodynamics.service.RDSkillService;
import com.robodynamics.service.WhatsAppService;
import com.robodynamics.service.WhatsAppService.WhatsAppSendResult;
import com.robodynamics.service.RDLeadSkillService;
import com.robodynamics.service.RDMentorService;
import com.robodynamics.service.RDParentNeedService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpServletRequest;
import javax.validation.constraints.NotBlank;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/leads")
public class RDLeadController {

    @Autowired private RDLeadService leadService;
    @Autowired private RDLeadMentorService leadMentorService;
    @Autowired private RDSkillService skillService;
    @Autowired private RDLeadSkillService leadSkillService;
    @Autowired private RDMentorService mentorService;
    @Autowired private RDParentNeedService parentNeedsService;
    
    @Autowired private WhatsAppService whatsappService;


 // ----------------------------
 // Lead Capture (Parents & Mentors)
 // ----------------------------
 @PostMapping
 public String captureLead(@ModelAttribute LeadForm form, HttpServletRequest req) {
     String audience = normalizeAudience(form.getAudience());

     // Normalize subjects
     String subjectString = (form.getMessage() == null)
             ? ""
             : Arrays.stream(form.getMessage())
                     .map(String::trim)
                     .filter(s -> !s.isEmpty())
                     .distinct()
                     .collect(Collectors.joining(","));

     // Save lead
     RDLead saved = leadService.createLead(
         form.getName(),
         sanitizePhone(form.getPhone()),
         nvl(form.getEmail()),
         audience,
         nvl(form.getSource()),
         nvl(req.getParameter("utm_source")),
         nvl(req.getParameter("utm_medium")),
         nvl(req.getParameter("utm_campaign")),
         subjectString,
         form.getGrade(),
         req.getParameter("board")
     );

  // ---- WhatsApp Notifications ----
     if (saved != null && whatsappService != null) {
         try {
             // Normalize phone
             String digits = sanitizePhone(form.getPhone());
             String toE164 = digits.startsWith("91") ? "+" + digits : "+91" + digits;
             System.out.println("toE164 - " + toE164);
             // --- 1. Notify Parent ---
             if ("parent".equals(audience) && whatsappService.isValidE164(toE164)) {
                 WhatsAppSendResult r = whatsappService.sendLeadThankYouParent(
                         saved.getId(), form.getName(), toE164);
                 System.out.println("Parent WhatsApp sent: " + r.isOk());
             }

             // --- 2. Notify Mentor (if audience = mentor) ---
             if ("mentor".equals(audience) && whatsappService.isValidE164(toE164)) {
                 String msg = "Hi " + form.getName()
                            + ", thank you for applying as a mentor with Robo Dynamics! "
                            + "Our team will review your profile and reach out soon.";
                 whatsappService.sendText(toE164, msg);
             }

             // --- 3. Notify Admin ---
             String adminNumber = "whatsapp:+918374377311";  

        //     if (whatsappService.isValidE164(adminNumber)) {
            	 System.out.println("ID - " + saved.getId() +  form.getName() + form.getGrade() + form.getBoard() + toE164 + adminNumber);
                 WhatsAppSendResult ar = whatsappService.sendAdminLeadNotification(
                         saved.getId(),
                         form.getName(),
                         form.getGrade(),
                         form.getBoard(),
                         digits,         // parent phone
                         adminNumber     // send to admin
                 );
                 System.out.println("Admin WhatsApp sent: " + ar.isOk());
        //     }

         } catch (Exception e) {
             System.err.println("WhatsApp send failed: " + e.getMessage());
         }
     }

     // Save subjects as skills
     if (saved != null && form.getMessage() != null) {
         List<Long> skillIds = Arrays.stream(form.getMessage())
                                     .map(String::trim)
                                     .filter(s -> !s.isEmpty())
                                     .map(skillService::getOrCreateSkill)
                                     .map(RDSkill::getSkillId)
                                     .collect(Collectors.toList());

         if (!skillIds.isEmpty()) {
             leadSkillService.addLeadSkillsIfMissing(saved.getId(), skillIds);
         }

         if ("mentor".equals(audience)) {
             mentorService.upsertMentorFromLead(saved, null);
         }
     }

     // Redirect based on audience
     if ("mentor".equals(audience)) {
     	return "redirect:/thank-you"
     	        + "?audience=mentor"
     	        + "&name=" + url(form.getName())
     	        + "&phone=" + url(form.getPhone())
     	        + "&email=" + url(nvl(form.getEmail()));
     } else {
    	    return "redirect:/leads/questionnaire?leadId=" + saved.getId();
     }
 }

 @GetMapping("/questionnaire")
 public String showQuestionnaire(@RequestParam Long leadId, Model model) {
     RDLead lead = leadService.getLeadById(leadId);
     if (lead == null) {
         model.addAttribute("error", "Lead not found");
         return "error";
     }
     model.addAttribute("lead", lead);
     return "parents-questionnaire";
 }

 @PostMapping("/questionnaire/save")
 public String saveQuestionnaire(@RequestParam Long leadId,
                                 @RequestParam String learningPace,
                                 @RequestParam String interestLevel,
                                 @RequestParam String objective,
                                 @RequestParam String subjectPriority,
                                 @RequestParam String teacherStyle) {
     // TODO: Save to new table rd_parent_needs via parentNeedsService
     parentNeedsService.saveNeeds(leadId, learningPace, interestLevel, objective, subjectPriority, teacherStyle);

     return "redirect:/parents/mentors?leadId=" + leadId;
 }


    // ----------------------------
    // Leads Dashboard: Admin vs Mentor
    // ----------------------------
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

    // ----------------------------
    // View Lead with mentor assignments
    // ----------------------------
    @GetMapping("/view/{id}")
    public String viewLead(@PathVariable("id") Long leadId,
                           HttpSession session,
                           Model model) {
        RDLead lead = leadService.getLeadById(leadId);
        model.addAttribute("lead", lead);

        List<RDMentorAssignment> assignments = leadMentorService.getAssignmentsForLead(leadId);

        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        if (currentUser != null && currentUser.getProfile_id() == 3) {
            assignments = assignments.stream()
                    .filter(a -> a.getMentor().getUserID() == currentUser.getUserID())
                    .collect(Collectors.toList());
        }

        model.addAttribute("mentorAssignments", assignments);
        return "lead_view";
    }

    // ----------------------------
    // Edit Lead (Admin only)
    // ----------------------------
    @GetMapping("/edit/{id}")
    public String editLead(@PathVariable("id") Long leadId, HttpSession session, Model model) {
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        if (currentUser == null || currentUser.getProfile_id() != 1) {
            return "redirect:/leads/dashboard";
        }

        RDLead lead = leadService.getLeadById(leadId);
        model.addAttribute("lead", lead);
        return "lead_edit";
    }

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

    // ----------------------------
    // Delete Lead (Admin only)
    // ----------------------------
    @GetMapping("/delete/{id}")
    public String deleteLead(@PathVariable("id") Long leadId, HttpSession session) {
        RDUser currentUser = (RDUser) session.getAttribute("rdUser");
        if (currentUser == null || currentUser.getProfile_id() != 1) {
            return "redirect:/leads/dashboard";
        }

        leadService.deleteLead(leadId);
        return "redirect:/leads/dashboard";
    }

    // ----------------------------
    // Helpers
    // ----------------------------
    private static String nvl(String s) {
        return s == null ? "" : s;
    }

    private static String sanitizePhone(String p) {
        if (p == null) return "";
        String digits = p.replaceAll("\\D", "");
        if (digits.startsWith("91") && digits.length() == 12) digits = digits.substring(2);
        if (digits.startsWith("0")  && digits.length() == 11) digits = digits.substring(1);
        return digits.isEmpty() ? p.trim() : digits;
    }

    private static String url(String s) {
        try { return java.net.URLEncoder.encode(nvl(s), "UTF-8"); }
        catch (Exception e) { return ""; }
    }

    private static String normalizeAudience(String a) {
        return (a == null) ? "parent" : a.trim().toLowerCase();
    }

    // ----------------------------
    // Lightweight LeadForm
    // ----------------------------
    public static class LeadForm {
        @NotBlank private String name;
        @NotBlank private String phone;
        @NotBlank private String audience;
        private String email;
        private String grade;
        private String board;
        private String source;
        private String[] message;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAudience() { return audience; }
        public void setAudience(String audience) { this.audience = audience; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public String[] getMessage() { return message; }
        public void setMessage(String[] message) { this.message = message; }
		public String getBoard() {
			return board;
		}
		public void setBoard(String board) {
			this.board = board;
		}
        
        
    }
}
