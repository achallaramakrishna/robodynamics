package com.robodynamics.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDEnquiryDao;
import com.robodynamics.dao.RDVisitorLogDao;
import com.robodynamics.model.RDVisitorLog;
import com.robodynamics.service.RDVisitorLogService;

@Service
public class RDVisitorLogServiceImpl implements RDVisitorLogService {

	@Autowired
	private RDVisitorLogDao rdVisitorDao;

	@Override
	@Transactional
	public void saveRDVisitorLog(RDVisitorLog rdVisitorLog) {
		rdVisitorDao.saveRDVisitorLog(rdVisitorLog);

	}

	@Override
	@Transactional
	public RDVisitorLog getRDVisitorLog(int visitorLogId) {
		return rdVisitorDao.getRDVisitorLog(visitorLogId);
	}

	@Override
	@Transactional
	public List<RDVisitorLog> getRDVisitorLogs() {
		return rdVisitorDao.getRDVisitorLogs();
	}

	@Override
	@Transactional
	public void deleteRDVisitorLog(int id) {
		rdVisitorDao.deleteRDVisitorLog(id);

	}

	public void logVisit(String ipAddress, String url) {
		RDVisitorLog visitorLog = new RDVisitorLog();
		visitorLog.setIpAddress(ipAddress);
		visitorLog.setUrl(url);
		visitorLog.setTimestamp(LocalDateTime.now());
		rdVisitorDao.saveRDVisitorLog(visitorLog);
	}

}
