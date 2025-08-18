package com.robodynamics.dao.impl;

import java.util.Optional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.robodynamics.dao.RDTestScheduleDao;
import com.robodynamics.model.RDTestSchedule;

@Repository
public class RDTestScheduleDaoImpl implements RDTestScheduleDao {

    @Autowired
    private SessionFactory sessionFactory;

    private Session s() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public Optional<RDTestSchedule> findByTestId(Integer testId) {
        // If RDTestSchedule uses @MapsId(test_id), this works:
        RDTestSchedule sch = s().get(RDTestSchedule.class, testId);

        // Fallback: if PK isn’t test_id, resolve via association
        if (sch == null) {
            sch = s().createQuery(
                    "from RDTestSchedule x where x.test.testId = :tid",
                    RDTestSchedule.class)
                .setParameter("tid", testId)
                .uniqueResult();
        }
        return Optional.ofNullable(sch);
    }

    @Override
    public void saveOrUpdate(RDTestSchedule schedule) {
        if (schedule == null) return;
        if (schedule.getTest() == null) {
            // With @MapsId, the associated test must be set so test_id is populated
            throw new IllegalArgumentException("RDTestSchedule.test must not be null (expected @MapsId).");
        }
        s().saveOrUpdate(schedule);
    }

    @Override
    public void deleteByTestId(Integer testId) {
        // Try PK-first (when @MapsId makes test_id the PK)
        RDTestSchedule sch = s().get(RDTestSchedule.class, testId);
        if (sch == null) {
            sch = s().createQuery(
                    "from RDTestSchedule x where x.test.testId = :tid",
                    RDTestSchedule.class)
                .setParameter("tid", testId)
                .uniqueResult();
        }
        if (sch != null) {
            s().delete(sch);
        }
    }
}
