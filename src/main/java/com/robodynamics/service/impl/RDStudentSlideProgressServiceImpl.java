package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDStudentSlideProgressDao;
import com.robodynamics.model.RDStudentSlideProgress;
import com.robodynamics.service.RDStudentSlideProgressService;

@Service
@Transactional
public class RDStudentSlideProgressServiceImpl implements RDStudentSlideProgressService {

    @Autowired
    private RDStudentSlideProgressDao slideProgressDao;

    @Override
    public void saveOrUpdate(RDStudentSlideProgress slideProgress) {
        slideProgressDao.saveOrUpdate(slideProgress);
    }

    @Override
    public RDStudentSlideProgress findById(int slideProgressId) {
        return slideProgressDao.findById(slideProgressId);
    }

    @Override
    public RDStudentSlideProgress findByEnrollmentAndSlide(int enrollmentId, int slideId) {
        return slideProgressDao.findByEnrollmentAndSlide(enrollmentId, slideId);
    }

    @Override
    public List<RDStudentSlideProgress> findAllByEnrollmentId(int enrollmentId) {
        return slideProgressDao.findAllByEnrollmentId(enrollmentId);
    }

    @Override
    public void delete(RDStudentSlideProgress slideProgress) {
        slideProgressDao.delete(slideProgress);
    }
}
