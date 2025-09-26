package com.robodynamics.controller;

import com.robodynamics.model.RDLead;
import com.robodynamics.service.RDLeadMentorService;
import com.robodynamics.service.RDLeadService;
import com.robodynamics.service.WhatsAppService;
import com.robodynamics.service.WhatsAppService.WhatsAppSendResult;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Controller
public class RDDemoController {

    @Autowired
    private RDLeadService leadService; // optional—won't crash if absent
    
    @Autowired private RDLeadMentorService leadMentorService;
    
    @Autowired private WhatsAppService whatsappService;           // <— add


    @GetMapping("/parents/demo")
    public String showDemoForm(@RequestParam(value = "prefill", required = false) String prefill,
                               Model model) {
        // if redirected from /leads with ?prefill=1, show a small banner in JSP
        model.addAttribute("prefill", "1".equals(prefill));
        return "parents-demo"; // /WEB-INF/views/parents-demo.jsp
    }

    @PostMapping("/parents/demo")
    public String submitDemo(
            @RequestParam String parentName,
            @RequestParam String parentPhone,
            @RequestParam(required = false) String studentName,
            @RequestParam(required = false) String grade,
            @RequestParam(required = false) String board,
            @RequestParam(required = false) String subjects,
            @RequestParam String demoDateTime,
            @RequestParam(required = false) String parentEmail,
            @RequestParam(required = false) Long leadId,   // <-- NEW
            @RequestParam(required = false, defaultValue = "0") int prefill, // or read param "prefill"
            HttpServletRequest req,
            Model model) {
    	
        Long resolvedLeadId = (prefill == 1 && leadId != null) ? leadId : null;

        
        final String audience = "parent";
        final String safeSource = Optional.ofNullable(req.getParameter("source"))
                                          .filter(s -> !s.isBlank())
                                          .orElse("home_parent_simple"); // or "demo_min_v1"


        if (leadService != null) {
            try {
                String msg = String.format(
                    "DEMO REQUEST — When: %s | Student: %s | Grade: %s | Board: %s | Subjects: %s",
                    Optional.ofNullable(demoDateTime).orElse("n/a"),
                    Optional.ofNullable(studentName).orElse(""),
                    Optional.ofNullable(grade).orElse(""),
                    Optional.ofNullable(board).orElse(""),
                    Optional.ofNullable(subjects).orElse("")
                );

                if (leadId != null) {
                    // Update existing lead
                    leadService.updateFromDemo(
                        leadId,
                        Optional.ofNullable(parentEmail).orElse(""),
                        Optional.ofNullable(studentName).orElse(""),
                        Optional.ofNullable(grade).orElse(""),
                        Optional.ofNullable(board).orElse(""),
                        Optional.ofNullable(subjects).orElse(""),
                        Optional.ofNullable(demoDateTime).orElse(""),
                        msg
                    );
                } else {
                    // Fallback: upsert by normalized phone/email (idempotent if you added dedupe)
                    String source = Optional.ofNullable(req.getParameter("source")).orElse("demo_min_v1");
                    leadService.capture(
                        parentName,
                        parentPhone,
                        Optional.ofNullable(parentEmail).orElse(""),
                        grade,
                        board,
                        "parent",
                        source,
                        Optional.ofNullable(req.getParameter("utm_source")).orElse(""),
                        Optional.ofNullable(req.getParameter("utm_medium")).orElse(""),
                        Optional.ofNullable(req.getParameter("utm_campaign")).orElse(""),
                        msg
                    );
                }
                
             // Only trigger mentor matching if demo date is provided
                if (demoDateTime != null && !demoDateTime.isEmpty() && leadMentorService != null) {
                    RDLead leadForMatching = leadService.getLeadById(leadId);
                    leadMentorService.assignLeadToMentors(leadForMatching);
                }
            } catch (Exception ignore) { /* don’t block UX */ }
            
            
        }
     // ---- WhatsApp: Parent Thank-You (uses twilio.templates.parent.thankyou or wa.fallback.parent.thankyou) ----
        try {
            // very light E.164 normalize; feel free to move to a shared util
            String digits = parentPhone.replaceAll("\\D", "");
            System.out.println("Digits - " + digits);
            String toE164 = digits.startsWith("0") ? "+91" + digits.substring(1)
                          : digits.startsWith("91") ? "+".concat(digits)
                          : parentPhone.startsWith("+") ? parentPhone
                          : "+91" + digits; // default to +91
            System.out.print("Parent Phone : " + toE164);

            if (whatsappService != null && whatsappService.isValidE164(toE164)) {
                long idForMsg = (resolvedLeadId != null ? resolvedLeadId : 0L);
                System.out.println("Id for message : "  + idForMsg);
                WhatsAppSendResult r = whatsappService.sendLeadThankYouParent(idForMsg, parentName, toE164);
                // Optional: log r.isOk() / r.getErrorMessage()
            }
        } catch (Exception ignore) { /* never block redirect */ }
        // -----------------------------------------------------------------------------------------------------------

        

        String n = URLEncoder.encode(parentName, StandardCharsets.UTF_8);
        return "redirect:/thank-you?audience=parent&name=" + n;
    }

}
