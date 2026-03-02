package com.robodynamics.dao;

import java.time.LocalDateTime;

import com.robodynamics.model.RDMarketingBooking;

public interface RDMarketingBookingDao {

    RDMarketingBooking save(RDMarketingBooking booking);

    long countByStatusAndRange(String status, LocalDateTime from, LocalDateTime toExclusive);
}
