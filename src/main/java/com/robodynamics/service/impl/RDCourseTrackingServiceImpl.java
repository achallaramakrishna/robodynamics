package com.robodynamics.service.impl;

import com.robodynamics.dao.RDCourseTrackingDAO;
import com.robodynamics.dto.RDCourseTrackingDTO;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseTracking;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDClassSessionService;
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
    private RDClassSessionService classSessionService;
    
    
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
	public void saveOrUpdateCourseTracking(int enrollmentId, Integer sessionId, int classSessionId,
	                                       String feedback, LocalDate trackingDate,
	                                       MultipartFile[] files, RDUser student, RDUser mentor) {

	    RDCourseTracking existing = trackingDAO.findByEnrollmentAndDate(enrollmentId, trackingDate);
	    
	    if (existing != null) {
	        existing.setFeedback(feedback);
	        existing.setUser(student);
	        existing.setCourseSession(sessionService.getCourseSession(sessionId));
	        existing.setTrackingDate(trackingDate);
	        existing.setCreatedBy(mentor);
	        trackingDAO.updateTracking(existing);
	        System.out.println("🔄 Course tracking updated for enrollmentId: " + enrollmentId);
	    } else {
	        RDCourseTracking newTracking = new RDCourseTracking();
	        newTracking.setStudentEnrollment(enrollmentService.getRDStudentEnrollment(enrollmentId));
	        newTracking.setUser(student);
	        newTracking.setCourseSession(sessionService.getCourseSession(sessionId));
	        newTracking.setFeedback(feedback);
	        newTracking.setTrackingDate(trackingDate);
	        newTracking.setCreatedBy(mentor);
	        newTracking.setClassSession(classSessionService.getRDClassSession(classSessionId));
	        trackingDAO.saveTracking(newTracking);
	        System.out.println("✅ Course tracking saved for enrollmentId: " + enrollmentId);
	    }
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

    @Override
    @Transactional
    public void save(RDCourseTracking tracking) {
    	trackingDAO.save(tracking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCourseTracking> getTrackingsByStudent(int studentId) {
        return trackingDAO.getTrackingsByStudent(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCourseTracking> getTrackingsByCourseSession(int courseSessionId) {
        return trackingDAO.getTrackingsByCourseSession(courseSessionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCourseTracking> getTrackingsByClassSession(int classSessionId) {
    
    
        return trackingDAO.getTrackingsByClassSession(classSessionId);
    }

	@Override
    @Transactional(readOnly = true)
	public RDCourseTracking findByEnrollmentAndDate(Integer enrollmentId, LocalDate today) {
        return trackingDAO.findByEnrollmentAndDate(enrollmentId, today);
	}

	
    @Transactional(readOnly = true)
	public List<RDCourseTracking> getTrackingByEnrollment(int enrollmentId) {
    	return trackingDAO.getTrackingByEnrollment(enrollmentId);
	}

	@Override
	@Transactional
	public List<RDCourseTrackingDTO> getTrackingByEnrollment(Integer enrollmentId) {
		// TODO Auto-generated method stub
		return trackingDAO.getTrackingByEnrollment(enrollmentId);
	}
    
    

	
}