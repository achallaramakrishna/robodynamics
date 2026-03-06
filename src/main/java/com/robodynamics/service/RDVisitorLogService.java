package com.robodynamics.service;

import java.time.LocalDateTime;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.robodynamics.model.RDVisitorLog;

public interface RDVisitorLogService {

	public void saveRDVisitorLog(RDVisitorLog rdVisitorLog);

	public RDVisitorLog getRDVisitorLog(int visitorLogId);
	
	public List < RDVisitorLog > getRDVisitorLogs();
	
    public void deleteRDVisitorLog(int id);
    
    void logVisit(String ipAddress, String url);

	public void logVisitAsync(String clientIP, String url);

    void logVisitAsync(HttpServletRequest request);

    long countVisitsSince(LocalDateTime fromTime);

    long countDistinctIpsSince(LocalDateTime fromTime);

    long countDistinctUrlsSince(LocalDateTime fromTime);

    long countLoggedInVisitsSince(LocalDateTime fromTime);

    long countAnonymousVisitsSince(LocalDateTime fromTime);

    long countDistinctLoggedInUsersSince(LocalDateTime fromTime);

    long countVisitsByUrlPatternSince(LocalDateTime fromTime, String urlPattern);

    List<Object[]> topUrlsSince(LocalDateTime fromTime, int maxRows);

    List<Object[]> topLoggedInUsersSince(LocalDateTime fromTime, int maxRows);

    List<Object[]> topCountriesSince(LocalDateTime fromTime, int maxRows);

    long countVisitsBetween(LocalDateTime startInclusive, LocalDateTime endExclusive);

    long countDistinctIpsBetween(LocalDateTime startInclusive, LocalDateTime endExclusive);

    long countDistinctUrlsBetween(LocalDateTime startInclusive, LocalDateTime endExclusive);

    long countLoggedInVisitsBetween(LocalDateTime startInclusive, LocalDateTime endExclusive);

    long countAnonymousVisitsBetween(LocalDateTime startInclusive, LocalDateTime endExclusive);

    long countDistinctLoggedInUsersBetween(LocalDateTime startInclusive, LocalDateTime endExclusive);

    long countVisitsByUrlPatternBetween(LocalDateTime startInclusive, LocalDateTime endExclusive, String urlPattern);

    List<Object[]> topUrlsBetween(LocalDateTime startInclusive, LocalDateTime endExclusive, int maxRows);

    List<Object[]> topLoggedInUsersBetween(LocalDateTime startInclusive, LocalDateTime endExclusive, int maxRows);

    List<Object[]> topCountriesBetween(LocalDateTime startInclusive, LocalDateTime endExclusive, int maxRows);

    int deleteLogsBefore(LocalDateTime cutoff);
}
