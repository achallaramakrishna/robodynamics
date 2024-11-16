package com.robodynamics.service.impl;

import com.robodynamics.dao.RDCourseTrackingDAO;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseTracking;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDCourseTrackingService;
import com.robodynamics.service.RDStudentEnrollmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.StringJoiner;

@Service
public class RDCourseTrackingServiceImpl implements RDCourseTrackingService {

    @Autowired
    private RDCourseTrackingDAO trackingDAO;
    
    @Autowired
    private RDStudentEnrollmentService enrollmentService;

    @Autowired
    private RDCourseSessionService sessionService;
    
    private final String uploadDir = "/uploads/course-tracking/";


    @Override
    @Transactional(readOnly = true)
    public RDCourseTracking getTrackingById(int trackingId) {
        return trackingDAO.getTrackingById(trackingId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCourseTracking> getTrackingByStudent(int studentId) {
        return trackingDAO.getTrackingByStudent(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCourseTracking> getTrackingByCourseSession(int courseSessionId) {
        return trackingDAO.getTrackingByCourseSession(courseSessionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCourseTracking> getAllTrackingEntries() {
        return trackingDAO.getAllTrackingEntries();
    }

	@Override
    @Transactional
	public List<RDCourseTracking> getTrackingByStudentAndOffering(int studentId, int courseOfferingId) {
		return trackingDAO.getTrackingByStudentAndOffering(studentId,courseOfferingId);
	}

	@Override
    @Transactional
	public List<RDCourseTracking> getTrackingEntriesByEnrollmentId(int studentEnrollmentId) {
		return trackingDAO.getTrackingByEnrollmentId(studentEnrollmentId);
	}

	@Override
	@Transactional
	public void saveTracking(int studentEnrollmentId, int courseSessionId, String feedback, LocalDate trackingDate,
			MultipartFile[] files, RDUser rdUser) {
		// Fetch related entities
        RDStudentEnrollment studentEnrollment = enrollmentService.getRDStudentEnrollment(studentEnrollmentId);
        RDCourseSession courseSession = sessionService.getCourseSession(courseSessionId);

        // Prepare tracking entity
        RDCourseTracking tracking = new RDCourseTracking();
        tracking.setStudentEnrollment(studentEnrollment);
        tracking.setCourseSession(courseSession);
        tracking.setFeedback(feedback);
        
        tracking.setTrackingDate(trackingDate != null ? trackingDate : LocalDate.now());
        tracking.setUser(studentEnrollment.getStudent());
        tracking.setCreatedBy(rdUser);

        // Save file paths
        String filePaths = saveUploadedFiles(files);
        tracking.setFilePaths(filePaths);

        // Persist tracking entity
        trackingDAO.saveTracking(tracking);
		
	}
	
	@Override
    public String saveUploadedFiles(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            return null;
        }

        // Ensure upload directory exists
        File uploadDirectory = new File(uploadDir);
        if (!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        // Save files and build comma-separated list of file paths
        StringJoiner filePaths = new StringJoiner(",");
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                try {
                    String originalFileName = file.getOriginalFilename();
                    File destinationFile = new File(uploadDirectory, originalFileName);
                    file.transferTo(destinationFile);
                    filePaths.add(destinationFile.getAbsolutePath());
                } catch (IOException e) {
                    e.printStackTrace();
                    // Log an error and continue with other files
                }
            }
        }

        return filePaths.toString();
    }

	@Override
	@Transactional
    public void updateTracking(RDCourseTracking tracking) {
        // Update tracking entry in the database
        trackingDAO.update(tracking);
    }

    @Override
    @Transactional
    public void deleteTracking(int trackingId) {
        // Delete tracking entry from the database
        trackingDAO.delete(trackingId);
    }
}
