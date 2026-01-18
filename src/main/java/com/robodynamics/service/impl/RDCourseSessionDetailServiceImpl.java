package com.robodynamics.service.impl;

import java.io.InputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDCourseSessionDetailDao;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDCourseSessionDetail.TierLevel;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.wrapper.CourseSessionDetailJson;
import com.robodynamics.wrapper.CourseSessionJson;

@Service
public class RDCourseSessionDetailServiceImpl implements RDCourseSessionDetailService {

	@Autowired
	private RDCourseService courseService;
	
	@Autowired
	private RDCourseSessionDetailDao rdCourseSessionDetailDao;
	
	@Autowired
	private RDCourseSessionService rdCourseSessionService;
	
	@Override
	public void saveRDCourseSessionDetail(RDCourseSessionDetail rdCourseSessionDetail) {
		rdCourseSessionDetailDao.saveRDCourseSessionDetail(rdCourseSessionDetail);

	}

	@Override
	@Transactional
	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId) {
		
		return rdCourseSessionDetailDao.getRDCourseSessionDetail(courseSessionDetailId);
	}

	@Override
	@Transactional
	public List<RDCourseSessionDetail> getRDCourseSessionDetails(int sessionId) {
		
		return rdCourseSessionDetailDao.getRDCourseSessionDetails(sessionId);
	}
	
	@Override
	@Transactional
	public List<RDCourseSessionDetail> getRDCourseSessionDetailsByCourseId(int courseId) {
		
		return rdCourseSessionDetailDao.getRDCourseSessionDetailsByCourseId(courseId);
	}

	@Override
	@Transactional
	public void deleteRDCourseSessionDetail(int id) {
		rdCourseSessionDetailDao.deleteRDCourseSessionDetail(id);
	}

	@Override
	@Transactional
	public List<RDCourseSessionDetail> findSessionDetailsBySessionId(int sessionId) {
        return rdCourseSessionDetailDao.findSessionDetailsBySessionId(sessionId);

	}

	@Override
	@Transactional
	public void processSessionDetail(CourseSessionDetailJson detail, int courseSessionId,int courseId) {
	    // Check if session detail already exists based on sessionId and sessionDetailId
	    System.out.println("Step 21 ..." + courseSessionId );
	    try {
	    // Retrieve course session and course session detail based on sessionId and sessionDetailId\
	    RDCourse course = courseService.getRDCourse(courseId);
	    RDCourseSession courseSession = rdCourseSessionService.getCourseSession(courseSessionId);
	    System.out.println("Course Session id : " + courseSession.getCourseSessionId());
	    RDCourseSessionDetail existingDetail = rdCourseSessionDetailDao.getRDCourseSessionDetailByIdAndDetailId(courseSessionId, detail.getSessionDetailId());

	    System.out.println("Step 22 ...");
	    System.out.println("ExistingDetail - " + existingDetail);
	    
	    if (existingDetail != null) {
	        System.out.println("existing Step 22 ...");
	        System.out.println("Existing detail - " + existingDetail.getCourseSessionDetailId());

	        // Update the existing detail
	        existingDetail.setCourse(course);
	        existingDetail.setTopic(detail.getTopic());
	        existingDetail.setVersion(detail.getVersion());
	        existingDetail.setType(detail.getType());
	        existingDetail.setFile(detail.getFile());
	     // Assuming sessionDetailJson.getTierLevel() returns a string, like "BEGINNER", "INTERMEDIATE", or "ADVANCED"
	        String tierLevelString = detail.getTierLevel();

	        // Convert the string to TierLevel enum and set it
	        if (tierLevelString != null) {
	        	existingDetail.setTierLevel(TierLevel.valueOf(tierLevelString.toUpperCase()));
	        } else {
	        	existingDetail.setTierLevel(null); // Handle null case if needed
	        }
	        rdCourseSessionDetailDao.saveRDCourseSessionDetail(existingDetail);

	    } else {
	        // Add a new session detail
	        System.out.println("Step 23 ...");
		    RDCourseSession courseSession1 = rdCourseSessionService.getCourseSession(courseSessionId);

	        RDCourseSessionDetail newDetail = new RDCourseSessionDetail();
	        newDetail.setCourse(course);
	        newDetail.setCourseSession(courseSession1);
	        newDetail.setSessionDetailId(detail.getSessionDetailId());
	        newDetail.setTopic(detail.getTopic());
	        newDetail.setVersion(detail.getVersion());
	        newDetail.setType(detail.getType());
	        newDetail.setFile(detail.getFile());
	 
	        // Assuming sessionDetailJson.getTierLevel() returns a string, like "BEGINNER", "INTERMEDIATE", or "ADVANCED"
	        String tierLevelString = detail.getTierLevel();

	        // Convert the string to TierLevel enum and set it
	        if (tierLevelString != null) {
	        	newDetail.setTierLevel(TierLevel.valueOf(tierLevelString.toUpperCase()));
	        } else {
	        	newDetail.setTierLevel(null); // Handle null case if needed
	        }
	 
	        rdCourseSessionDetailDao.saveRDCourseSessionDetail(newDetail);
	    }
	    } catch(Exception e) {
	        System.out.println("Error during transaction: " + e.getMessage());

	    	e.printStackTrace();
	    }
	    
	  
	}

	@Override
	public List<RDCourseSessionDetail> findByTierLevel(RDCourseSessionDetail.TierLevel tierLevel) {
		return rdCourseSessionDetailDao.findByTierLevel(tierLevel);
	}

	@Override
	public List<RDCourseSessionDetail> findByTierLevelOrderedByTierOrder(RDCourseSessionDetail.TierLevel tierLevel) {
		return rdCourseSessionDetailDao.findByTierLevelOrderedByTierOrder(tierLevel);
	}

	@Override
	@Transactional
	public Integer countByType(int sessionId, String string) {
		
		return rdCourseSessionDetailDao.countByType(sessionId,string);
	}

	@Override
	@Transactional
	public List<RDCourseSessionDetail> getBySessionAndType(int sessionId, String string) {
		
		return rdCourseSessionDetailDao.getBySessionAndType(sessionId, string);
	}
}
