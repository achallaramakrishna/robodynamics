package com.robodynamics.controller;

import com.robodynamics.service.RDWhatsAppService;
import com.twilio.exception.ApiException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@Controller
public class RDSendController {

    private final RDWhatsAppService wa;

    // constructor injection
    public RDSendController(RDWhatsAppService wa) {
        this.wa = wa;
    }

    // ----- Free-form text -----
    @GetMapping("/wa/send")
    public String sendForm() {
        return "wa-send";
    }

    @PostMapping("/wa/send")
    public String send(@RequestParam String to,
                       @RequestParam String text,
                       Model model) {
        try {
            String sid = wa.sendText(to, text);
            model.addAttribute("sid", sid);
            model.addAttribute("message", "Text message queued.");
        } catch (ApiException e) {
            model.addAttribute("error", explain(e));
        } catch (Exception e) {
            model.addAttribute("error", "Failed to send: " + e.getMessage());
        }
        return "wa-result";
    }

    // ----- Media -----
    @GetMapping("/wa/send-media")
    public String sendMediaForm() {
        return "wa-send-media";
    }

    @PostMapping("/wa/send-media")
    public String sendMedia(@RequestParam String to,
                            @RequestParam(required = false) String text,
                            @RequestParam String mediaUrl,
                            HttpServletRequest req,
                            Model model) {
        try {
            String sid = wa.sendMedia(to, (text == null ? "" : text), absolute(req, mediaUrl));
            model.addAttribute("sid", sid);
            model.addAttribute("message", "Media message queued.");
        } catch (ApiException e) {
            model.addAttribute("error", explain(e));
        } catch (Exception e) {
            model.addAttribute("error", "Failed to send media: " + e.getMessage());
        }
        return "wa-result";
    }

    // ----- Template (uses Messaging Service + Content SID) -----
    @GetMapping("/wa/send-template")
    public String sendTemplateForm() {
        return "wa-template";
    }

    @PostMapping("/wa/send-template")
    public String sendTemplate(@RequestParam String to,
                               @RequestParam String name,
                               Model model) {
        try {
            String sid = wa.sendTemplate(to, name);
            System.out.println("Sid - " + sid);
            model.addAttribute("sid", sid);
            model.addAttribute("message", "Template message queued.");
        } catch (ApiException e) {
            model.addAttribute("error", explain(e));
        } catch (Exception e) {
            model.addAttribute("error", "Failed to send template: " + e.getMessage());
        }
        return "wa-result";
    }

    // ----- Helpers -----
    private String absolute(HttpServletRequest req, String url) {
        if (url == null) return null;
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        String base = req.getScheme() + "://" + req.getServerName()
                + ((req.getServerPort() == 80 || req.getServerPort() == 443) ? "" : (":" + req.getServerPort()))
                + req.getContextPath();
        return base + (url.startsWith("/") ? "" : "/") + url;
    }

    private String explain(ApiException e) {
        // Common WhatsApp window error
        if (e.getCode() != null && e.getCode() == 63016) {
            return "Undelivered (63016): Recipient hasn’t messaged in the last 24 hours. "
                 + "Use an approved WhatsApp template to re-open the conversation.";
        }
        return "Twilio error" + (e.getCode() != null ? " (" + e.getCode() + ")" : "") + ": " + e.getMessage();
    }
}
