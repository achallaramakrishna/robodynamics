package com.robodynamics.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;

import com.robodynamics.dto.RDSessionItem;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDTest;
import com.robodynamics.model.RDTestDetailRole;
import com.robodynamics.model.RDTestType;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDVisibility;
import com.robodynamics.dto.*;

public interface RDTestService {

    /* ========================= CREATE ========================= */

    /** Unified create that checks the actor’s role and permissions. */
    RDTest createTest(RDUser actor,
                      Integer courseId,
                      String title,
                      RDTestType type,
                      Integer totalMarks,
                      Integer passingMarks,
                      LocalDate testDate);

    /* ======================== READ/LIST ======================== */

    /** Controller uses this for admin listing (optionally filtered). */
    List<RDTest> findAll(String q, Integer courseId);

    /** Controller uses this for mentor listing. */
    List<RDTest> findForMentor(int mentorUserId, String q, Integer courseId);

    /** Controller uses this for student listing. */
    List<RDTest> findForStudent(int studentUserId, String q, Integer courseId);

    /** Kept for parent listing (already used elsewhere in your app). */
    List<RDTest> findByParent(Integer parentUserId, Integer courseId, String q);

    /** Calendar helper (legacy parent flavor). */
    List<RDTest> findByParentBetweenByTestDate(Integer parentUserId,
                                               LocalDate startInclusive,
                                               LocalDate endExclusive,
                                               Integer courseId);

    /** Role-aware single fetch; controller uses this in /edit and /map-sessions loads. */
    RDTest findByIdIfAllowed(Integer testId, RDUser actor);

    /** Role-aware + fetch-joins mappings/sessions to avoid lazy issues in JSP. */
    RDTest findByIdWithSessionsIfAllowed(Integer testId, RDUser actor);

    /** (Legacy) parent-only variant still used by older JSPs. */
    RDTest findOwnedByParent(Integer testId, Integer parentUserId);

    /** (Legacy) parent-only + sessions fetch-join. */
    RDTest findOwnedByParentWithSessions(Integer testId, int parentUserId);


    /* ======================= UPDATE/DELETE ====================== */

    /** Role-aware update; controller calls this in /tests/edit POST. */
    void updateIfAllowed(Integer testId,
                         RDUser actor,
                         Integer courseId,
                         String title,
                         RDTestType type,
                         Integer totalMarks,
                         Integer passingMarks,
                         LocalDate testDate);

    /** Role-aware delete; controller calls this in /tests/delete POST. */
    void deleteIfAllowed(Integer testId, RDUser actor);

    /** (Legacy) parent-only update. */
    void updateOwnedByParentSimple(Integer testId,
                                   Integer parentUserId,
                                   Integer courseId,
                                   String title,
                                   RDTestType type,
                                   Integer totalMarks,
                                   Integer passingMarks,
                                   LocalDate testDate);

    /** (Legacy) parent-only delete. */
    void deleteOwnedByParent(Integer testId, Integer parentUserId);


    /* ===================== COURSES BY ROLE ===================== */

    /** Controller helper: show all courses admins can attach tests to. */
    List<RDCourse> allowedCoursesForAdmin();

    /** Controller helper: mentor-scoped courses. */
    List<RDCourse> allowedCoursesForMentor(int mentorUserId);

    /** Controller helper: parent-scoped courses (existing). */
    List<RDCourse> allowedCoursesForParent(int parentUserId);

    /** Controller helper: student-scoped courses (if you expose create/view etc.). */
    List<RDCourse> allowedCoursesForStudent(int studentUserId);


    /* ==================== SESSIONS (CHAPTERS) =================== */

    /** Role-aware session lookup used by controller (map/create forms). */
    List<RDSessionItem> findCourseSessions(RDUser actor,
                                           Integer courseId,
                                           Integer offeringId,
                                           String sessionType);

    /** (Legacy) parent-only session lookup (already used elsewhere). */
    List<RDSessionItem> findCourseSessionsForParent(int parentUserId,
                                                    Integer courseId,
                                                    Integer offeringId,
                                                    String sessionType);


    /* ============== LINKING (rd_test_session table) ============== */

    /** Used by controller: link single session to a test (records who did it via uploadedBy + visibility). */
    void linkSession(Integer testId,
                     Integer courseSessionId,
                     RDTestDetailRole role,
                     Integer uploadedBy,
                     String notes,
                     RDVisibility visibility);

    /** Bulk helper used by legacy parent create flow; safe to keep. */
    default void linkSessions(Integer testId,
                              List<Integer> courseSessionIds,
                              RDTestDetailRole role,
                              Integer uploadedBy) {
        if (courseSessionIds == null) return;
        for (Integer sid : courseSessionIds) {
            linkSession(testId, sid, role, uploadedBy, null, RDVisibility.PARENT);
        }
    }

    /** Unlink mapping (controller uses during saveMappings diff). */
    void unlinkSession(Integer testId, Integer courseSessionId);

    /** For preselects in map-sessions.jsp. */
    List<Integer> findLinkedSessionIds(Integer testId);


    /* =================== EXTRA CONVENIENCE (optional) =================== */

    /** If you still need a parent-centric list for old pages. */
    List<RDTest> listTestsForParent(int userId);

    /** Calendar (role-aware) — optional if you add a role-aware calendar tab later. */
    List<RDTest> listVisibleBetweenByTestDate(RDUser actor,
                                              LocalDate startInclusive,
                                              LocalDate endExclusive,
                                              Integer courseId);
    
    Map<Integer, Long> countEnrollmentsForTests(List<Integer> testIds);
    Map<Integer, List<RDTestEnrollSummaryDTO>> enrollmentsByTest(List<Integer> testIds, 
                                                               Integer offeringIdFilter,
                                                               String gradeFilter,
                                                               String studentQuery);

	List<RDTest> findForAdminOrMentorOrParent(String q, Integer courseId);

	void updateScheduleFile(Integer testId, Consumer<RDTest> mutator);



    
}
