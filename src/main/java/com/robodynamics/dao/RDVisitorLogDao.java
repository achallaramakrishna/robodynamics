package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDVisitorLog;

public interface RDVisitorLogDao {

	public void saveRDVisitorLog(RDVisitorLog rdVisitorLog);

	public RDVisitorLog getRDVisitorLog(int visitorLogId);
	
	public List < RDVisitorLog > getRDVisitorLogs();
	
    public void deleteRDVisitorLog(int id);
}
