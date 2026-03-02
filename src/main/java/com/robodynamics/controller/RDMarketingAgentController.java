package com.robodynamics.controller;

import java.time.LocalDate;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.robodynamics.service.RDMarketingAgentService;

@RestController
@RequestMapping("/marketing/api")
public class RDMarketingAgentController {

    @Autowired
    private RDMarketingAgentService marketingAgentService;

    @PostMapping("/leads/upsert")
    public ResponseEntity<?> upsertLead(@RequestBody RDMarketingAgentService.LeadUpsertRequest request) {
        try {
            return ResponseEntity.ok(marketingAgentService.upsertLead(request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", ex.getMessage()));
        }
    }

    @PostMapping(value = "/whatsapp/twilio/inbound", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> twilioInbound(
            @RequestParam Map<String, String> formParams,
            @RequestHeader(value = "X-Twilio-Signature", required = false) String signature,
            HttpServletRequest request) {

        String requestUrl = resolveRequestUrl(request);
        Map<String, Object> result = marketingAgentService.handleInboundWhatsApp(formParams, requestUrl, signature);
        boolean accepted = Boolean.TRUE.equals(result.get("accepted"));
        return accepted ? ResponseEntity.ok(result) : ResponseEntity.status(HttpStatus.FORBIDDEN).body(result);
    }

    @PostMapping("/agent/run/{leadId}")
    public ResponseEntity<?> runAgent(@PathVariable Long leadId) {
        try {
            return ResponseEntity.ok(marketingAgentService.runAgent(leadId));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", ex.getMessage()));
        }
    }

    @PostMapping("/booking/create")
    public ResponseEntity<?> createBooking(@RequestBody RDMarketingAgentService.BookingCreateRequest request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(marketingAgentService.createBooking(request));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("status", "FAILED", "message", ex.getMessage()));
        }
    }

    @GetMapping("/dashboard/kpi")
    public ResponseEntity<?> kpi(
            @RequestParam(value = "from", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(value = "to", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(marketingAgentService.getKpis(from, to));
    }

    private String resolveRequestUrl(HttpServletRequest request) {
        String proto = headerOrNull(request, "X-Forwarded-Proto");
        String host = headerOrNull(request, "X-Forwarded-Host");
        if (proto != null && host != null) {
            return proto + "://" + host + request.getRequestURI();
        }
        return request.getRequestURL().toString();
    }

    private String headerOrNull(HttpServletRequest request, String name) {
        String value = request.getHeader(name);
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        int comma = value.indexOf(',');
        return comma > 0 ? value.substring(0, comma).trim() : value.trim();
    }
}
