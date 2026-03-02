package com.robodynamics.dao.impl;

import java.time.LocalDateTime;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDMarketingBookingDao;
import com.robodynamics.model.RDMarketingBooking;

@Repository
@Transactional
public class RDMarketingBookingDaoImpl implements RDMarketingBookingDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDMarketingBooking save(RDMarketingBooking booking) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(booking);
        return booking;
    }

    @Override
    public long countByStatusAndRange(String status, LocalDateTime from, LocalDateTime toExclusive) {
        Session session = sessionFactory.getCurrentSession();
        Long count = session.createQuery(
                        "select count(b.bookingId) from RDMarketingBooking b " +
                                "where b.status = :status and b.createdAt >= :from and b.createdAt < :toExclusive",
                        Long.class)
                .setParameter("status", status)
                .setParameter("from", from)
                .setParameter("toExclusive", toExclusive)
                .uniqueResult();
        return count == null ? 0L : count;
    }
}
