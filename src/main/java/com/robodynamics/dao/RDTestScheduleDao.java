package com.robodynamics.dao;

import java.util.Optional;

import com.robodynamics.model.RDTestSchedule;

public interface RDTestScheduleDao {

    /** Load the schedule for a given test. */
    Optional<RDTestSchedule> findByTestId(Integer testId);

    /** Create or update the schedule (works with @MapsId shared PK). */
    void saveOrUpdate(RDTestSchedule schedule);

    /** Remove the schedule row for a test (if present). */
    void deleteByTestId(Integer testId);
}
