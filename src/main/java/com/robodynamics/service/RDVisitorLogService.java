package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDVisitorLog;

public interface RDVisitorLogService {

	public void saveRDVisitorLog(RDVisitorLog rdVisitorLog);

	public RDVisitorLog getRDVisitorLog(int visitorLogId);
	
	public List < RDVisitorLog > getRDVisitorLogs();
	
    public void deleteRDVisitorLog(int id);
    
    void logVisit(String ipAddress, String url);

	public void logVisitAsync(String clientIP, String url);
}
