package com.robodynamics.service;

import java.time.LocalDateTime;
import java.util.List;

import com.robodynamics.model.RDVisitorLog;

public interface RDVisitorLogService {

	public void saveRDVisitorLog(RDVisitorLog rdVisitorLog);

	public RDVisitorLog getRDVisitorLog(int visitorLogId);
	
	public List < RDVisitorLog > getRDVisitorLogs();
	
    public void deleteRDVisitorLog(int id);
    
    void logVisit(String ipAddress, String url);

	public void logVisitAsync(String clientIP, String url);

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

    int deleteLogsBefore(LocalDateTime cutoff);
}
