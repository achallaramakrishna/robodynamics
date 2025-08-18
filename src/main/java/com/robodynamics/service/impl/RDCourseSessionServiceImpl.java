package com.robodynamics.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDCourseSessionDao;
import com.robodynamics.dto.RDSessionItem;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSession.TierLevel;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.wrapper.CourseSessionJson;
import com.robodynamics.wrapper.CourseSessionsWrapper;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class RDCourseSessionServiceImpl implements RDCourseSessionService {

    @Autowired
    private RDCourseSessionDao courseSessionDao;
    
    
    @Autowired
    private RDCourseService courseService;

    @Override
    public void saveCourseSession(RDCourseSession courseSession) {
        // Save or update the course session (unit or session)
        courseSessionDao.saveRDCourseSession(courseSession);
    }

    @Override
    public RDCourseSession getCourseSession(int courseSessionId) {
        // Fetch a course session by its ID
        return courseSessionDao.getRDCourseSession(courseSessionId);
    }

    @Override
    public List<RDCourseSession> getAllCourseSessions() {
        // Retrieve all course sessions (units and sessions)
        return courseSessionDao.getRDCourseSessions();
    }

    @Override
    public List<RDCourseSession> getCourseSessionsByCourseId(int courseId) {
        // Retrieve all course sessions by course ID
        return courseSessionDao.getCourseSessionsByCourseId(courseId);
    }

    @Override
    public void deleteCourseSession(int courseSessionId) {
        // Delete a course session by its ID
        courseSessionDao.deleteRDCourseSession(courseSessionId);
    }

    @Override
    public void processJson(MultipartFile file, int selectedCourseId) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            // Convert JSON file into CourseSessionsWrapper object
            CourseSessionsWrapper wrapper = objectMapper.readValue(file.getInputStream(), CourseSessionsWrapper.class);

            // Fetch existing sessions for the selected course
            List<RDCourseSession> existingSessions = courseSessionDao.getCourseSessionsByCourseId(selectedCourseId);

            // Map existing sessions by sessionId for easy lookup
            Map<Integer, RDCourseSession> existingSessionsMap = existingSessions.stream()
                .collect(Collectors.toMap(RDCourseSession::getSessionId, session -> session));

            // Map to keep track of all processed sessions by sessionId
            Map<Integer, RDCourseSession> processedSessionsMap = new HashMap<>();

            List<RDCourseSession> courseSessionsToSave = new ArrayList<>();

            // Fetch the course once
            RDCourse course = courseService.getRDCourse(selectedCourseId);

            // First, process all units and sessions, create RDCourseSession objects, and store them in the map
            for (CourseSessionJson sessionJson : wrapper.getSessions()) {
                RDCourseSession courseSession;

                // Check if session ID exists in the database
                if (existingSessionsMap.containsKey(sessionJson.getSessionId())) {
                    // Update the existing session
                    courseSession = existingSessionsMap.get(sessionJson.getSessionId());
                    courseSession.setSessionTitle(sessionJson.getSessionTitle());
                    courseSession.setVersion(sessionJson.getVersion());
                    courseSession.setGrade(sessionJson.getGrade());
                    courseSession.setSessionType(sessionJson.getSessionType());
                    courseSession.setSessionDescription(sessionJson.getSessionDescription());
                 // Assuming sessionJson.getTierLevel() returns a string, like "BEGINNER", "INTERMEDIATE", or "ADVANCED"
                    String tierLevelString = sessionJson.getTierLevel();

                    // Convert the string to TierLevel enum and set it
                    if (tierLevelString != null) {
                        courseSession.setTierLevel(TierLevel.valueOf(tierLevelString.toUpperCase()));
                    } else {
                        courseSession.setTierLevel(null); // Handle null case if needed
                    }
                    courseSession.setTierOrder(sessionJson.getTierOrder());
                } else {
                    // Create a new session if it doesn't exist
                    courseSession = new RDCourseSession();
                    courseSession.setSessionId(sessionJson.getSessionId());
                    courseSession.setSessionTitle(sessionJson.getSessionTitle());
                    courseSession.setVersion(sessionJson.getVersion());
                    courseSession.setGrade(sessionJson.getGrade());
                    courseSession.setSessionType(sessionJson.getSessionType());
                    courseSession.setSessionDescription(sessionJson.getSessionDescription());
                    courseSession.setCourse(course);

                    // Assuming sessionJson.getTierLevel() returns a string, like "BEGINNER", "INTERMEDIATE", or "ADVANCED"
                    String tierLevelString = sessionJson.getTierLevel();

                    // Convert the string to TierLevel enum and set it
                    if (tierLevelString != null) {
                        courseSession.setTierLevel(TierLevel.valueOf(tierLevelString.toUpperCase()));
                    } else {
                        courseSession.setTierLevel(null); // Handle null case if needed
                    }
                    courseSession.setTierOrder(sessionJson.getTierOrder());

                }

                // Add the session to the map for future reference
                processedSessionsMap.put(sessionJson.getSessionId(), courseSession);
            }

            // Now, set parent sessions and add sessions to the list to save
            for (CourseSessionJson sessionJson : wrapper.getSessions()) {
                RDCourseSession courseSession = processedSessionsMap.get(sessionJson.getSessionId());

                // Handle parent session (if any)
                if (sessionJson.getParentSessionId() != null) {
                    RDCourseSession parentSession = processedSessionsMap.get(sessionJson.getParentSessionId());
                    if (parentSession != null) {
                        courseSession.setParentSession(parentSession);
                    } else {
                        throw new Exception("Parent session with sessionId " + sessionJson.getParentSessionId() + " not found for sessionId " + sessionJson.getSessionId());
                    }
                } else {
                    // For units, ensure parentSession is null
                    courseSession.setParentSession(null);
                }

                // Add to the list to save
                courseSessionsToSave.add(courseSession);
            }

            // Persist the sessions (both new and updated)
            // Save parents before children to ensure parent IDs are generated
            courseSessionsToSave.sort(Comparator.comparingInt(cs -> cs.getParentSession() == null ? 0 : 1));
            courseSessionDao.saveAll(courseSessionsToSave);

        } catch (Exception e) {
            throw new Exception("Error processing JSON file: " + e.getMessage(), e);
        }
    }

    @Override
    public RDCourseSession getCourseSessionBySessionIdAndCourseId(int sessionId, Integer courseId) {
        return courseSessionDao.getCourseSessionBySessionIdAndCourseId(sessionId, courseId);
    }

    // **Implementation of New Methods**

    @Override
    public List<RDCourseSession> getUnitsByCourseId(int courseId) {
        return courseSessionDao.getUnitsByCourseId(courseId);
    }

    @Override
    public List<RDCourseSession> getSessionsByUnitId(int unitId) {
        return courseSessionDao.getSessionsByUnitId(unitId);
    }

    @Override
    public List<RDCourseSession> getCourseHierarchyByCourseId(int courseId) {
        return courseSessionDao.getCourseHierarchyByCourseId(courseId);
    }

    @Override
    public void saveAllCourseSessions(List<RDCourseSession> courseSessions) {
        courseSessionDao.saveAll(courseSessions);
    }

	@Override
	public List<RDCourseSession> getSessionsByCourseAndTier(int courseId, String tierLevel) {

		return courseSessionDao.findByCourseIdAndTierLevelOrderByTierOrder(courseId, tierLevel);
	}

	@Override
	public List<RDCourseSession> findByTierLevel(TierLevel tierLevel) {
		return courseSessionDao.findByTierLevel(tierLevel);
	}

	@Override
	public List<RDCourseSession> findByTierLevelOrderedByTierOrder(TierLevel tierLevel) {
		return courseSessionDao.findByTierLevelOrderedByTierOrder(tierLevel);
	}

	@Override
	public List<RDCourseSession> getCourseSessionsByCourseOfferingId(int courseOfferingId) {
		return courseSessionDao.getCourseSessionsByCourseOfferingId(courseOfferingId);
	}

	@Override
	public List<RDSessionItem> findSessionItemsByCourse(Integer courseId, String sessionType) {
		// TODO Auto-generated method stub
		return courseSessionDao.findSessionItemsByCourse(courseId, sessionType);
	}
}
