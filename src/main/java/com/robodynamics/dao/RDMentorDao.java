// src/main/java/com/robodynamics/dao/RDMentorDao.java
package com.robodynamics.dao;

import com.robodynamics.dto.RDMentorDTO;
import java.util.List;

public interface RDMentorDao {
    List<RDMentorDTO> findAllMentorsBasic();
    List<RDMentorDTO> findMentorsSummary(); // with offeringsCount
}
