package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDStudentSessionProgressDao;
import com.robodynamics.model.RDStudentSessionProgress;
import com.robodynamics.service.RDStudentSessionProgressService;

@Service
@Transactional
public class RDStudentSessionProgressServiceImpl implements RDStudentSessionProgressService {

    @Autowired
    private RDStudentSessionProgressDao sessionProgressDao;

    @Override
    public void saveOrUpdate(RDStudentSessionProgress sessionProgress) {
        sessionProgressDao.saveOrUpdate(sessionProgress);
    }

    @Override
    public RDStudentSessionProgress findById(int sessionProgressId) {
        return sessionProgressDao.findById(sessionProgressId);
    }

    @Override
    public RDStudentSessionProgress findByEnrollmentAndSession(int enrollmentId, int sessionId) {
        return sessionProgressDao.findByEnrollmentAndSession(enrollmentId, sessionId);
    }

    @Override
    public List<RDStudentSessionProgress> findAllByEnrollmentId(int enrollmentId) {
        return sessionProgressDao.findAllByEnrollmentId(enrollmentId);
    }

    @Override
    public void delete(RDStudentSessionProgress sessionProgress) {
        sessionProgressDao.delete(sessionProgress);
    }
}
