package com.robodynamics.dao;

import com.robodynamics.model.RDLead;
import java.util.List;
import java.util.Optional;

public interface RDLeadDao {
    RDLead save(RDLead lead);
    Optional<RDLead> findById(Long id);
    List<RDLead> findRecent(int limit);
    List<RDLead> findByStatus(String status, int limit);
    void updateStatus(Long id, String status);
    RDLead findByPhone(String phone);
    RDLead saveOrUpdate(RDLead lead);
    
    // NEW: choose based on your uniqueness rule — recommended: (phone, audience)
    Optional<RDLead> findByPhoneAndAudience(String phone, RDLead.Audience audience);
    
    RDLead getLeadById(Long id);
    List<RDLead> getAllLeads();
    void deleteLead(Long id);
}
