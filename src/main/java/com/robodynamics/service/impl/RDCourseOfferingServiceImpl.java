package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.service.RDAssetService;
import com.robodynamics.service.RDAssetTransactionService;
import com.robodynamics.service.RDCourseOfferingService;

@Service
public class RDCourseOfferingServiceImpl implements RDCourseOfferingService {

	@Autowired
	private RDCourseOfferingDao rdCourseOfferingDao;

	@Override
	@Transactional
	public void saveRDCourseOffering(RDCourseOffering rdCourseOffering) {
		rdCourseOfferingDao.saveRDCourseOffering(rdCourseOffering);
	}

	@Override
	public RDCourseOffering getRDCourseOffering(int rdCourseOfferingId) {
		return rdCourseOfferingDao.getRDCourseOffering(rdCourseOfferingId);
	}

	@Override
	public List<RDCourseOffering> getRDCourseOfferings() {
		return rdCourseOfferingDao.getRDCourseOfferings();
	}

	@Override
	public void deleteRDCourseOffering(int id) {
		rdCourseOfferingDao.deleteRDCourseOffering(id);
		
	}

	@Override
	public List<RDCourseOffering> getRDCourseOfferingsList(int userId) {
		return rdCourseOfferingDao.getRDCourseOfferingsList(userId);
	}

	@Override
	@Transactional
	public RDCourseOffering getOnlineCourseOffering(int courseId) {
		
		return rdCourseOfferingDao.getOnlineCourseOffering(courseId);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getRDCourseOfferingsListByCourse(int courseId) {
		return rdCourseOfferingDao.getRDCourseOfferingsListByCourse(courseId);
	}
	
}
