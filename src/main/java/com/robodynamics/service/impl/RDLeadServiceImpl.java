package com.robodynamics.service.impl;

import com.robodynamics.dao.RDLeadDao;
import com.robodynamics.model.RDLead;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDLeadService;
import com.robodynamics.service.RDNotificationService;
import com.robodynamics.service.RDUserService;

import java.util.List;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RDLeadServiceImpl implements RDLeadService {

    @Autowired
    private RDLeadDao leadDao;

    @Autowired
    private RDNotificationService notificationService;
    
    @Autowired
    private RDUserService userService;

    @Override
    @Transactional
    public RDLead capture(String name, String phone, String email, String audience,
                          String source, String utmSource, String utmMedium, String utmCampaign,
                          String message) {

        final String normPhone = normalizePhone(phone);
        final RDLead.Audience audEnum = toAudience(audience);

        // 1) Try to find existing (idempotent key: phone+audience)
        RDLead existing = leadDao.findByPhoneAndAudience(normPhone, audEnum).orElse(null);

        if (existing != null) {
            // 2) Update existing
            existing.setName(safe(name));
            existing.setEmail(blankToNull(email));
            existing.setSource(blankToNull(source));
            existing.setUtmSource(blankToNull(utmSource));
            existing.setUtmMedium(blankToNull(utmMedium));
            existing.setUtmCampaign(blankToNull(utmCampaign));
            if (!isBlank(message)) existing.setMessage(message.trim());
            // keep status lifecycle simple on capture
            if (existing.getStatus() == null) existing.setStatus(RDLead.Status.NEW);
            return leadDao.saveOrUpdate(existing);
        }

        // 3) Insert new
        RDLead l = new RDLead();
        l.setName(safe(name));
        l.setPhone(normPhone);
        l.setEmail(blankToNull(email));
        l.setAudience(audEnum);
        l.setSource(blankToNull(source));
        l.setUtmSource(blankToNull(utmSource));
        l.setUtmMedium(blankToNull(utmMedium));
        l.setUtmCampaign(blankToNull(utmCampaign));
        l.setMessage(blankToNull(message));
        l.setStatus(RDLead.Status.NEW);

        try {
            return leadDao.save(l);
        } catch (ConstraintViolationException dup) {
            // 4) Race condition: someone inserted same (phone,audience) concurrently → merge
            RDLead concurrent = leadDao.findByPhoneAndAudience(normPhone, audEnum).orElse(null);
            if (concurrent != null) {
                concurrent.setName(safe(name));
                concurrent.setEmail(blankToNull(email));
                concurrent.setSource(blankToNull(source));
                concurrent.setUtmSource(blankToNull(utmSource));
                concurrent.setUtmMedium(blankToNull(utmMedium));
                concurrent.setUtmCampaign(blankToNull(utmCampaign));
                if (!isBlank(message)) concurrent.setMessage(message.trim());
                if (concurrent.getStatus() == null) concurrent.setStatus(RDLead.Status.NEW);
                return leadDao.saveOrUpdate(concurrent);
            }
            throw dup; // unexpected
        }
    }

    private void sendNotificationsToAdminsAndSuperAdmins(RDLead lead) {
        // Fetch all admins and super admins
        List<RDUser> admins = userService.getAllAdminsAndSuperAdmins();

        // Send notification to each admin
        for (RDUser admin : admins) {
            notificationService.createNotification(
                admin.getUserID(), // Admin's user ID
                "Lead Demo Updated",
                "Demo details have been updated for lead: " + lead.getName(),
                "/admin/lead/" + lead.getId() // Admin's lead details page
            );
        }
    }
    
    @Override
    @Transactional
    public RDLead updateFromDemo(Long leadId,
                                 String parentEmail,
                                 String studentName,
                                 String grade,
                                 String board,
                                 String subjects,
                                 String demoDateTime,
                                 String message) {

        // Step 1: Fetch the lead object based on the provided leadId
        RDLead lead = leadDao.findById(leadId)
                .orElseThrow(() -> new IllegalArgumentException("Lead not found: " + leadId));

        // Step 2: Update the lead details (parentEmail, message, etc.)
        if (!isBlank(parentEmail)) {
            lead.setEmail(parentEmail.trim());
        }

        String demoNote = !isBlank(message) ? message.trim()
                : "DEMO REQUEST — When: " + nz(demoDateTime)
                + " | Student: " + nz(studentName)
                + " | Grade: " + nz(grade)
                + " | Board: " + nz(board)
                + " | Subjects: " + nz(subjects);

        // Step 3: Combine the updated message with timestamp
        String ts = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Kolkata"))
                .format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
        String existing = lead.getMessage();
        String combined = (isBlank(existing))
                ? ("[" + ts + "] " + demoNote)
                : (existing.trim() + "\n---\n[" + ts + "] " + demoNote);
        lead.setMessage(combined);

        lead.setStatus(RDLead.Status.CONTACTED); // Update lead status to "Contacted"

        // Step 4: Save the updated lead
        leadDao.saveOrUpdate(lead);

        // Step 5: Send Notifications to Admin and Mentor
        sendNotificationsToAdminsAndSuperAdmins(lead);

        return lead;
    }

    
    // ---------- helpers ----------
    private static RDLead.Audience toAudience(String audience) {
        String v = safe(audience).toLowerCase();
        if ("parent".equals(v)) return RDLead.Audience.PARENT;
        if ("mentor".equals(v)) return RDLead.Audience.MENTOR;
        throw new IllegalArgumentException("Unknown audience: " + audience);
    }

    private static String normalizePhone(String phone) {
        String p = safe(phone).replaceAll("[^0-9]", "");
        if (p.startsWith("0")) p = p.substring(1);
        // India-style: store as E.164-ish without '+' → ensure country code present
        if (p.length() == 10) p = "91" + p;
        return p;
    }

    private static boolean isBlank(String s) { return s == null || s.trim().isEmpty(); }
    private static String safe(String s) { return s == null ? "" : s.trim(); }
    private static String blankToNull(String s) { s = safe(s); return s.isEmpty() ? null : s; }
    private static String nz(String s) { return isBlank(s) ? "n/a" : s.trim(); }

	@Override
	@Transactional
	public List<RDLead> getAllLeads() {
		return leadDao.getAllLeads();
	}

	@Override
	@Transactional
	public RDLead getLeadById(Long id) {
		return leadDao.getLeadById(id);
	}

	@Override
	@Transactional
	public void saveOrUpdateLead(RDLead lead) {
		leadDao.saveOrUpdate(lead);
		
	}

	@Override
	@Transactional
	public void deleteLead(Long id) {
		leadDao.deleteLead(id);
		
	}
}
