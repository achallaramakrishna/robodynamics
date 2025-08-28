package com.robodynamics.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.robodynamics.dto.RDSessionItem;
import com.robodynamics.dto.RDTestEnrollSummaryDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDTest;
import com.robodynamics.model.RDTestDetailRole;
import com.robodynamics.model.RDVisibility;

public interface RDTestDao {

    /* ------------ CRUD ------------ */
    RDTest save(RDTest test);
    void update(RDTest test);

    /* ------------ Single fetch (role-aware) ------------ */
    RDTest findByIdWithCourse(Integer testId);	
    RDTest findByIdWithSessionsForAdmin(Integer testId);

    RDTest findByIdIfMentor(Integer testId, int mentorUserId);
    RDTest findByIdWithSessionsIfMentor(Integer testId, int mentorUserId);

    RDTest findByIdIfStudent(Integer testId, int studentUserId);
    RDTest findByIdWithSessionsIfStudent(Integer testId, int studentUserId);

    RDTest findOwnedByParent(Integer testId, Integer parentUserId);
    RDTest findOwnedByParentWithSessions(Integer testId, int parentUserId);

    /* ------------ Lists (role-aware) ------------ */
    List<RDTest> findAllForAdmin(String q, Integer courseId);
    List<RDTest> findForMentor(int mentorUserId, String q, Integer courseId);
    List<RDTest> findForStudent(int studentUserId, String q, Integer courseId);
    List<RDTest> findByParent(Integer parentUserId, Integer courseId, String q);

    /* ------------ Ranged lists (calendar feeds) ------------ */
    List<RDTest> findBetweenForAdmin(LocalDate start, LocalDate end, Integer courseId);
    List<RDTest> findBetweenForMentor(int mentorUserId, LocalDate start, LocalDate end, Integer courseId);
    List<RDTest> findBetweenForStudent(int studentUserId, LocalDate start, LocalDate end, Integer courseId);
    List<RDTest> findByParentBetween(Integer parentUserId, LocalDate start, LocalDate end, Integer courseId);

    /* ------------ Delete (role-aware) ------------ */
    void deleteAsAdmin(Integer testId);
    void deleteIfMentor(Integer testId, int mentorUserId);
    void deleteOwnedByParent(Integer testId, Integer parentUserId);

    /* ------------ Linking to sessions (rd_test_session) ------------ */
    boolean linkSession(Integer testId, Integer courseSessionId,
                        RDTestDetailRole role, Integer uploadedBy,
                        String notes, RDVisibility visibility);
    void unlinkSession(Integer testId, Integer courseSessionId);
    List<Integer> findLinkedSessionIds(Integer testId);

    /* ------------ Allowed courses by role ------------ */
    List<RDCourse> allowedCoursesForAdmin();
    List<RDCourse> allowedCoursesForMentor(int mentorUserId);
    List<RDCourse> allowedCoursesForParent(int parentUserId);
    List<RDCourse> allowedCoursesForStudent(int studentUserId);

    /* ------------ Session items (for mapping UI) ------------ */
    List<RDSessionItem> findCourseSessionsGeneric(Integer courseId, Integer offeringId, String sessionType);
    List<RDSessionItem> findCourseSessionsForParent(int parentUserId, Integer courseId, Integer offeringId, String sessionType);
	Map<Integer, Long> countEnrollmentsForTests(List<Integer> testIds);
	Map<Integer, List<RDTestEnrollSummaryDTO>> enrollmentsByTest(List<Integer> testIds, Integer offeringIdFilter,
			String gradeFilter, String studentQuery);
	List<RDTest> findForAdminOrMentorOrParent(String q, Integer courseId);
	
	 // Optional, if you want role-aware variants (recommended)
    List<RDTest> findByParent(int parentUserId, Integer courseId, String q);
	RDTest findById(Integer testId);
    
    
}
