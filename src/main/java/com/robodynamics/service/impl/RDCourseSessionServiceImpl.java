package com.robodynamics.service.impl;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.wrapper.CourseSessionJson;
import com.robodynamics.wrapper.CourseSessionsWrapper;
import com.robodynamics.dao.RDCourseSessionDao;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;


import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;



@Service
@Transactional
public class RDCourseSessionServiceImpl implements RDCourseSessionService {

    @Autowired
    private RDCourseSessionDao courseSessionDao;
    
    @Autowired
    private RDCourseService courseService;

    @Override
    public void saveCourseSession(RDCourseSession courseSession) {
        // Save or update the course session
        courseSessionDao.saveRDCourseSession(courseSession);
    }

    @Override
    public RDCourseSession getCourseSession(int courseSessionId) {
        // Fetch a course session by its ID
        return courseSessionDao.getRDCourseSession(courseSessionId);
    }

    @Override
    public List<RDCourseSession> getAllCourseSessions() {
        // Retrieve all course sessions
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
    public void processCsv(MultipartFile file, int selectedCourseId) throws Exception {
        List<RDCourseSession> courseSessions = new ArrayList<>();
        int courseIdFromCsv = -1; // Placeholder to hold the courseId from the CSV

        System.out.println("hello inside processCsv file .... ");
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withHeader())) {

            // Iterate through CSV records
            for (CSVRecord record : csvParser) {
                RDCourseSession courseSession = new RDCourseSession();

                // Parse and validate courseId for the first row
                int courseId = Integer.parseInt(record.get("Course ID"));
                if (courseIdFromCsv == -1) {
                    courseIdFromCsv = courseId; // Initialize for the first row
                }

                // Validate that all rows belong to the same course
                if (courseId != selectedCourseId) {
                    throw new Exception("CSV file contains data for multiple courses. Please ensure all sessions belong to the selected course.");
                }

                // Map CSV columns to CourseSession fields
                int sessionId = Integer.parseInt(record.get("Session ID"));
                String sessionTitle = record.get("Session Title");
                int version = Integer.parseInt(record.get("Version"));

                // Set parsed values to the courseSession object
                courseSession.setSessionId(sessionId);
                courseSession.setSessionTitle(sessionTitle);
                courseSession.setVersion(version);

                // Associate the session with the course
                RDCourse course = new RDCourse();
                course.setCourseId(courseId);
                courseSession.setCourse(course);

                // Add the session to the list
                courseSessions.add(courseSession);
            }

            // Persist the sessions
            courseSessionDao.saveAll(courseSessions);

        } catch (Exception e) {
            throw new Exception("Error processing CSV file: " + e.getMessage());
        }
    }

    @Override
    public void processJson(MultipartFile file, int selectedCourseId) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();  // Jackson object mapper to handle JSON
        System.out.println("Step 21..");
        try {
            // Convert JSON file into CourseSessionsWrapper object
            CourseSessionsWrapper wrapper = objectMapper.readValue(file.getInputStream(), CourseSessionsWrapper.class);
            System.out.println("Step 22..");
            // Fetch existing sessions for the selected course
            List<RDCourseSession> existingSessions = courseSessionDao.getCourseSessionsByCourseId(selectedCourseId);
            System.out.println("Step 23..");
            // Map existing sessions by session ID for easy lookup
            Map<Integer, RDCourseSession> existingSessionsMap = existingSessions.stream()
                .collect(Collectors.toMap(RDCourseSession::getSessionId, session -> session));

            List<RDCourseSession> courseSessionsToSave = new ArrayList<>();
            System.out.println("Step 24..");
            // Iterate through sessions from the JSON file
            for (CourseSessionJson sessionJson : wrapper.getSessions()) {
                RDCourseSession courseSession;
                System.out.println("Step 25..");
                // Check if session ID exists in the database
                if (existingSessionsMap.containsKey(sessionJson.getSessionId())) {
                    // Update the existing session
                	System.out.println("Step 26..");
                    courseSession = existingSessionsMap.get(sessionJson.getSessionId());
                    courseSession.setSessionTitle(sessionJson.getSessionTitle());
                    courseSession.setVersion(sessionJson.getVersion());
                } else {
                    // Create a new session if it doesn't exist
                	System.out.println("Step 27..");
                    courseSession = new RDCourseSession();
                    courseSession.setSessionId(sessionJson.getSessionId());
                    courseSession.setSessionTitle(sessionJson.getSessionTitle());
                    courseSession.setVersion(sessionJson.getVersion());

                    // Associate the session with the course
                    RDCourse course = new RDCourse();
                    course.setCourseId(selectedCourseId);
                    courseSession.setCourse(course);
                }
                System.out.println("Step 28..");
                courseSessionsToSave.add(courseSession);
            }
            System.out.println("Step 29..");
            // Persist the sessions (both new and updated)
            courseSessionDao.saveAll(courseSessionsToSave);
            
            System.out.println("Step 30..");

        } catch (Exception e) {
            throw new Exception("Error processing JSON file: " + e.getMessage());
        }
    }

	@Override
	public RDCourseSession getCourseSessionBySessionIdAndCourseId(int sessionId, Integer courseId) {
		return courseSessionDao.getCourseSessionBySessionIdAndCourseId(sessionId, courseId);
	}

    


}