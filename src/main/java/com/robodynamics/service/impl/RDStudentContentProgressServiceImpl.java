package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDStudentContentProgressDao;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDStudentContentProgress;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDStudentSessionProgress;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDStudentContentProgressService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDStudentSessionProgressService;

@Service
@Transactional
public class RDStudentContentProgressServiceImpl implements RDStudentContentProgressService {

    @Autowired
    private RDStudentContentProgressDao contentProgressDao;
    
    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;
    
    @Autowired
    private RDStudentEnrollmentService enrollmentService;
    
    @Autowired
    private RDStudentSessionProgressService sessionProgressService;

    @Override
    public void saveOrUpdate(RDStudentContentProgress contentProgress) {
        contentProgressDao.saveOrUpdate(contentProgress);
    }

    @Override
    public RDStudentContentProgress findById(int contentProgressId) {
        return contentProgressDao.findById(contentProgressId);
    }

    @Override
    public RDStudentContentProgress findBySessionAndContentType(int sessionProgressId, String contentType) {
        return contentProgressDao.findBySessionAndContentType(sessionProgressId, contentType);
    }

    @Override
    public List<RDStudentContentProgress> findAllBySessionProgressId(int sessionProgressId) {
        return contentProgressDao.findAllBySessionProgressId(sessionProgressId);
    }

    @Override
    public void delete(RDStudentContentProgress contentProgress) {
        contentProgressDao.delete(contentProgress);
    }
    
    @Override
    public Double getProgressBySessionDetail(int enrollmentId, int sessionDetailId) {
        return contentProgressDao.findProgressByStudentAndSessionDetail(enrollmentId, sessionDetailId);
    }

    @Override
    public void updateStudentContentProgress(int enrollmentId, int sessionDetailId, String contentType, double progress) {
        // Fetch the session progress by enrollment and session details
        RDStudentSessionProgress sessionProgress = sessionProgressService.findByEnrollmentAndSession(enrollmentId, sessionDetailId);
    	RDStudentEnrollment enrollment = enrollmentService.getRDStudentEnrollment(enrollmentId);
    	RDCourseSessionDetail sessionDetail = courseSessionDetailService.getRDCourseSessionDetail(sessionDetailId);
    	System.out.println("hello 1111...");
        if (sessionProgress == null) {
            // If session progress doesn't exist, create a new one
        	
            sessionProgress = new RDStudentSessionProgress();
            sessionProgress.setEnrollment(enrollment);
            sessionProgress.setCourseSession(sessionDetail.getCourseSession());
            sessionProgress.setProgress(0.0);
            sessionProgressService.saveOrUpdate(sessionProgress);
        }

        // Check if content progress already exists
        RDStudentContentProgress contentProgress = contentProgressDao.findBySessionAndContentType(sessionProgress.getId(), sessionDetailId, contentType);
        
        if (contentProgress == null) {
            // If content progress doesn't exist, create a new one
            contentProgress = new RDStudentContentProgress();
            contentProgress.setSessionProgress(sessionProgress);
            contentProgress.setCourseSessionDetail(sessionDetail);
            contentProgress.setContentType(contentType);
            contentProgress.setProgress(progress);
        } else {
            // If progress exists, update it
            contentProgress.setProgress(progress);
        }

        // Save or update the content progress
        contentProgressDao.saveOrUpdate(contentProgress);

        // Optionally, you can update session progress based on the content progress
        // For example, average all the content progresses to determine the overall session progress.
        double overallProgress = contentProgressDao.calculateOverallProgress(sessionProgress.getId());
        sessionProgress.setProgress(overallProgress);
        sessionProgressService.saveOrUpdate(sessionProgress);
    }
}
