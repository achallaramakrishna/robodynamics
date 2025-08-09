// src/main/java/com/robodynamics/service/impl/RDMentorServiceImpl.java
package com.robodynamics.service.impl;

import com.robodynamics.dao.RDMentorDao;
import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.service.RDMentorService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class RDMentorServiceImpl implements RDMentorService {

    private final RDMentorDao mentorDao;

    public RDMentorServiceImpl(RDMentorDao mentorDao) {
        this.mentorDao = mentorDao;
    }

    @Override
    public List<RDMentorDTO> getAllMentors() {
        return mentorDao.findAllMentorsBasic();
    }

    @Override
    public List<RDMentorDTO> getMentorsWithSummary() {
        return mentorDao.findMentorsSummary();
    }
}
