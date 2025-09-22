package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDLead;

public interface RDLeadService {
	
	List<RDLead> getAllLeads();
    RDLead getLeadById(Long id);
    void saveOrUpdateLead(RDLead lead);
    void deleteLead(Long id);
    
    
    RDLead capture(String name, String phone, String email, String audience,
                   String source, String utmSource, String utmMedium, String utmCampaign,
                   String message, String grade, String board);

    RDLead updateFromDemo(Long leadId,
                          String parentEmail,
                          String studentName,
                          String grade,
                          String board,
                          String subjects,
                          String demoDateTime,   // HTML datetime-local, IST
                          String message);
}
