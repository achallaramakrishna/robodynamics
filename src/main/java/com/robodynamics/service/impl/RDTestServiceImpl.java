package com.robodynamics.service.impl;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCourseDao;
import com.robodynamics.dao.RDTestDao;
import com.robodynamics.dto.RDSessionItem;
import com.robodynamics.dto.RDTestEnrollSummaryDTO;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDTest;
import com.robodynamics.model.RDTestDetailRole;
import com.robodynamics.model.RDTestType;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDVisibility;
import com.robodynamics.service.RDTestService;

@Service
public class RDTestServiceImpl implements RDTestService {

    private final RDTestDao testDao;
    private final RDCourseDao courseDao;

    public RDTestServiceImpl(RDTestDao testDao, RDCourseDao courseDao) {
        this.testDao = testDao;
        this.courseDao = courseDao;
    }

    /* =========================================================
       CREATE (role-aware)
       ========================================================= */
    @Override
    @Transactional
    public RDTest createTest(RDUser actor,
                             Integer courseId,
                             String title,
                             RDTestType type,
                             Integer totalMarks,
                             Integer passingMarks,
                             LocalDate testDate) {

        if (actor == null) throw new IllegalArgumentException("actor required");
        if (courseId == null) throw new IllegalArgumentException("courseId required");
        if (title == null || title.trim().isEmpty()) throw new IllegalArgumentException("title required");
        if (type == null) throw new IllegalArgumentException("type required");
        if (testDate == null) throw new IllegalArgumentException("testDate required");

        // Basic role-based course permission (adjust as needed)
        List<RDCourse> allowed = allowedCoursesForUserInternal(actor);
        boolean ok = allowed.stream().anyMatch(c -> courseId.equals(c.getCourseId()));
        if (!ok) throw new IllegalArgumentException("You are not allowed to create tests for this course.");

        RDCourse course = courseDao.getRDCourse(courseId);
        if (course == null) throw new IllegalArgumentException("Course not found: " + courseId);

        RDTest t = new RDTest();
        t.setCourse(course);
        t.setTestTitle(title.trim());
        t.setTestType(type);
        t.setTotalMarks(totalMarks);
        t.setPassingMarks(passingMarks);
        t.setTestDate(testDate);
        t.setCreatedBy(actor.getUserID());

        return testDao.save(t);
    }

    /* =========================================================
       READ/LIST
       ========================================================= */
    @Override
    @Transactional(readOnly = true)
    public List<RDTest> findAll(String q, Integer courseId) {
        // DAO must implement: admin-visible list with optional filters.
        return testDao.findAllForAdmin(q, courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDTest> findForMentor(int mentorUserId, String q, Integer courseId) {
        // DAO must implement: tests relevant to mentor’s offerings/courses.
        return testDao.findForMentor(mentorUserId, q, courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDTest> findForStudent(int studentUserId, String q, Integer courseId) {
        // DAO must implement: tests visible to student (own, parent-shared, mentor-visible).
        return testDao.findForStudent(studentUserId, q, courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDTest> findByParent(Integer parentUserId, Integer courseId, String q) {
        return testDao.findByParent(parentUserId, courseId, q);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDTest> findByParentBetweenByTestDate(Integer parentUserId,
                                                      LocalDate startInclusive,
                                                      LocalDate endExclusive,
                                                      Integer courseId) {
        return testDao.findByParentBetween(parentUserId, startInclusive, endExclusive, courseId);
    }

    @Override
    @Transactional(readOnly = true)
    public RDTest findByIdIfAllowed(Integer testId, RDUser actor) {
        if (actor == null) return null;
        switch (actor.getProfile_id()) {
            case 1: // SUPER_ADMIN
            case 2: // ROBO_ADMIN
                return testDao.findByIdWithCourse(testId); // fetch join course for UI
            case 3: // ROBO_MENTOR
                return testDao.findByIdIfMentor(testId, actor.getUserID());
            case 4: // ROBO_PARENT
                return testDao.findOwnedByParent(testId, actor.getUserID());
            case 5: // ROBO_STUDENT
                return testDao.findByIdIfStudent(testId, actor.getUserID());
            default:
                return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RDTest findByIdWithSessionsIfAllowed(Integer testId, RDUser actor) {
        if (actor == null) return null;
        switch (actor.getProfile_id()) {
            case 1: // SUPER_ADMIN
            case 2: // ROBO_ADMIN
                return testDao.findByIdWithSessionsForAdmin(testId);
            case 3: // ROBO_MENTOR
                return testDao.findByIdWithSessionsIfMentor(testId, actor.getUserID());
            case 4: // ROBO_PARENT
                return testDao.findOwnedByParentWithSessions(testId, actor.getUserID());
            case 5: // ROBO_STUDENT
                return testDao.findByIdWithSessionsIfStudent(testId, actor.getUserID());
            default:
                return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public RDTest findOwnedByParent(Integer testId, Integer parentUserId) {
        return testDao.findOwnedByParent(testId, parentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public RDTest findOwnedByParentWithSessions(Integer testId, int parentUserId) {
        return testDao.findOwnedByParentWithSessions(testId, parentUserId);
    }

    /* =========================================================
       UPDATE / DELETE (role-aware)
       ========================================================= */
    @Override
    @Transactional
    public void updateIfAllowed(Integer testId,
                                RDUser actor,
                                Integer courseId,
                                String title,
                                RDTestType type,
                                Integer totalMarks,
                                Integer passingMarks,
                                LocalDate testDate) {

        RDTest t = findByIdIfAllowed(testId, actor);
        if (t == null) throw new IllegalArgumentException("Test not found or access denied.");

        // Optional: disallow student updates
        if (actor.getProfile_id() == 5) throw new IllegalArgumentException("Students cannot update tests.");

        if (courseId != null) {
            // Validate course permission for this actor
            boolean courseOk = allowedCoursesForUserInternal(actor)
                    .stream().anyMatch(c -> courseId.equals(c.getCourseId()));
            if (!courseOk) throw new IllegalArgumentException("You are not allowed to move this test to that course.");

            if (t.getCourse() == null || !courseId.equals(t.getCourse().getCourseId())) {
                RDCourse c = courseDao.getRDCourse(courseId);
                if (c == null) throw new IllegalArgumentException("Course not found: " + courseId);
                t.setCourse(c);
            }
        }

        if (title != null && !title.trim().isEmpty()) t.setTestTitle(title.trim());
        if (type != null) t.setTestType(type);
        t.setTotalMarks(totalMarks);
        t.setPassingMarks(passingMarks);
        if (testDate != null) t.setTestDate(testDate);

        testDao.update(t);
    }

    @Override
    @Transactional
    public void deleteIfAllowed(Integer testId, RDUser actor) {
        if (actor == null) throw new IllegalArgumentException("actor required");
        switch (actor.getProfile_id()) {
            case 1: // SUPER_ADMIN
            case 2: // ROBO_ADMIN
                testDao.deleteAsAdmin(testId);
                break;
            case 3: // ROBO_MENTOR
                testDao.deleteIfMentor(testId, actor.getUserID());
                break;
            case 4: // ROBO_PARENT
                testDao.deleteOwnedByParent(testId, actor.getUserID());
                break;
            case 5: // ROBO_STUDENT
                throw new IllegalArgumentException("Students cannot delete tests.");
            default:
                throw new IllegalArgumentException("Unsupported role.");
        }
    }

    /* Legacy parent-only update/delete kept for backward compatibility */
    @Override
    @Transactional
    public void updateOwnedByParentSimple(Integer testId, Integer parentUserId, Integer courseId, String title,
                                          RDTestType type, Integer totalMarks, Integer passingMarks,
                                          LocalDate testDate) {
        RDTest t = testDao.findOwnedByParent(testId, parentUserId);
        if (t == null) throw new IllegalArgumentException("Test not found or not owned by parent");

        if (courseId != null && (t.getCourse() == null || !courseId.equals(t.getCourse().getCourseId()))) {
            RDCourse course = courseDao.getRDCourse(courseId);
            if (course == null) throw new IllegalArgumentException("Course not found: " + courseId);
            t.setCourse(course);
        }
        if (title != null && !title.trim().isEmpty()) t.setTestTitle(title.trim());
        if (type != null) t.setTestType(type);
        t.setTotalMarks(totalMarks);
        t.setPassingMarks(passingMarks);
        if (testDate != null) t.setTestDate(testDate);

        testDao.update(t);
    }

    @Override
    @Transactional
    public void deleteOwnedByParent(Integer testId, Integer parentUserId) {
        testDao.deleteOwnedByParent(testId, parentUserId);
    }

    /* =========================================================
       COURSES BY ROLE
       ========================================================= */
    @Override
    @Transactional(readOnly = true)
    public List<RDCourse> allowedCoursesForAdmin() {
        // admins can see all courses
        return courseDao.getRDCourses();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCourse> allowedCoursesForMentor(int mentorUserId) {
        // DAO must implement mentor-scoped courses
        return testDao.allowedCoursesForMentor(mentorUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCourse> allowedCoursesForParent(int parentUserId) {
        return testDao.allowedCoursesForParent(parentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDCourse> allowedCoursesForStudent(int studentUserId) {
        // DAO must implement student-scoped courses
        return testDao.allowedCoursesForStudent(studentUserId);
    }

    /* =========================================================
       SESSIONS (CHAPTERS)
       ========================================================= */
    @Override
    @Transactional(readOnly = true)
    public List<RDSessionItem> findCourseSessions(RDUser actor,
                                                  Integer courseId,
                                                  Integer offeringId,
                                                  String sessionType) {
        if (actor == null || courseId == null) return Collections.emptyList();

        // Optional: verify actor has access to this course
        boolean ok = allowedCoursesForUserInternal(actor)
                .stream().anyMatch(c -> courseId.equals(c.getCourseId()));
        if (!ok) return Collections.emptyList();

        // DAO should return simple DTOs for the dropdowns
        return testDao.findCourseSessionsGeneric(courseId, offeringId, sessionType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDSessionItem> findCourseSessionsForParent(int userID, Integer courseId, Integer offeringId, String sessionType) {
        return testDao.findCourseSessionsForParent(userID, courseId, offeringId, sessionType);
    }

    /* =========================================================
       LINKING (rd_test_session)
       ========================================================= */
    @Override
    @Transactional
    public void linkSession(Integer testId, Integer courseSessionId, RDTestDetailRole role,
                            Integer uploadedBy, String notes, RDVisibility visibility) {
        RDTestDetailRole effRole = (role == null) ? RDTestDetailRole.PORTION : role;
        RDVisibility effVis = (visibility == null) ? RDVisibility.PARENT : visibility;
        testDao.linkSession(testId, courseSessionId, effRole, uploadedBy, notes, effVis);
    }

    @Override
    @Transactional
    public void unlinkSession(Integer testId, Integer courseSessionId) {
        testDao.unlinkSession(testId, courseSessionId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Integer> findLinkedSessionIds(Integer testId) {
        return testDao.findLinkedSessionIds(testId);
    }

    /* =========================================================
       EXTRAS
       ========================================================= */
    @Override
    @Transactional(readOnly = true)
    public List<RDTest> listTestsForParent(int userId) {
        List<RDTest> list = testDao.findByParent(userId, null, null);
        if (list == null || list.isEmpty()) return Collections.emptyList();

        list.sort(
            Comparator
                .comparing(RDTest::getTestDate, Comparator.nullsLast(Comparator.naturalOrder()))
                .thenComparing(RDTest::getTestId, Comparator.nullsLast(Comparator.naturalOrder()))
                .reversed()
        );
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDTest> listVisibleBetweenByTestDate(RDUser actor,
                                                     LocalDate startInclusive,
                                                     LocalDate endExclusive,
                                                     Integer courseId) {
        if (actor == null) return Collections.emptyList();
        switch (actor.getProfile_id()) {
            case 1: case 2: // admin
                return testDao.findBetweenForAdmin(startInclusive, endExclusive, courseId);
            case 3: // mentor
                return testDao.findBetweenForMentor(actor.getUserID(), startInclusive, endExclusive, courseId);
            case 4: // parent
                return testDao.findByParentBetween(actor.getUserID(), startInclusive, endExclusive, courseId);
            case 5: // student
                return testDao.findBetweenForStudent(actor.getUserID(), startInclusive, endExclusive, courseId);
            default:
                return Collections.emptyList();
        }
    }

    /* ===================== helpers ===================== */

    private List<RDCourse> allowedCoursesForUserInternal(RDUser user) {
        switch (user.getProfile_id()) {
            case 1: case 2: return allowedCoursesForAdmin();
            case 3:         return allowedCoursesForMentor(user.getUserID());
            case 4:         return allowedCoursesForParent(user.getUserID());
            case 5:         return allowedCoursesForStudent(user.getUserID());
            default:        return Collections.emptyList();
        }
    }

	@Override
	@Transactional
	public Map<Integer, Long> countEnrollmentsForTests(List<Integer> testIds) {
		return testDao.countEnrollmentsForTests(testIds);
	}

	@Override
	@Transactional
	public Map<Integer, List<RDTestEnrollSummaryDTO>> enrollmentsByTest(List<Integer> testIds, Integer offeringIdFilter,
			String gradeFilter, String studentQuery) {
		return testDao.enrollmentsByTest(testIds,offeringIdFilter,gradeFilter,studentQuery);
	}

	@Override
	@Transactional
	public List<RDTest> findForAdminOrMentorOrParent(String q, Integer courseId) {

		return testDao.findForAdminOrMentorOrParent(q,courseId);
	}
}
