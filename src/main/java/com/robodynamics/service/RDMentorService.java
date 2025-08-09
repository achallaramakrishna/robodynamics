// src/main/java/com/robodynamics/service/RDMentorService.java
package com.robodynamics.service;

import com.robodynamics.dto.RDMentorDTO;
import java.util.List;

public interface RDMentorService {
    List<RDMentorDTO> getAllMentors();          // basic list
    List<RDMentorDTO> getMentorsWithSummary();  // includes offeringsCount
}
