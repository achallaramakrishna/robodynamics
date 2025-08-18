package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCourse;

/**
 * Visibility/access queries used by parent-facing flows.
 */
public interface RDCourseAccessDao {

    /** All courses this parent can see (typically through their child’s enrollments). */
    List<RDCourse> findCoursesByParent(int parentUserId);

    /** True if the given course is visible/manageable by this parent. */
    boolean isCourseVisibleToParent(Integer courseId, Integer parentUserId);

    /**
     * Chapter/session-detail rows for a course.
     * Returned as a simple list the UI can turn into "id/name" options.
     * (By default this returns List<RDCourseSessionDetail>, but we keep it loose as List<?> to allow projections.)
     */
    List<?> findChapterDetailsByCourse(Integer courseId);
}
