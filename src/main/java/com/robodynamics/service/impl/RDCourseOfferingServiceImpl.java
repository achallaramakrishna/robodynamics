package com.robodynamics.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.dto.RDCourseOfferingSummaryDTO;
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
	@Transactional
	public RDCourseOffering getRDCourseOffering(int rdCourseOfferingId) {
		return rdCourseOfferingDao.getRDCourseOffering(rdCourseOfferingId);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getRDCourseOfferings() {
		return rdCourseOfferingDao.getRDCourseOfferings();
	}

	@Override
	@Transactional
	public void deleteRDCourseOffering(int id) {
		rdCourseOfferingDao.deleteRDCourseOffering(id);
		
	}

	@Override
	@Transactional
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

	@Override
	@Transactional
	public void deleteCourseOffering(int courseOfferingId) {
		
		rdCourseOfferingDao.deleteRDCourseOffering(courseOfferingId);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getCourseOfferingsByDate(LocalDate today) {
		// TODO Auto-generated method stub
		return rdCourseOfferingDao.getCourseOfferingsByDate(today);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getFilteredOfferings(Long courseId, Long mentorId, String status) {
		return rdCourseOfferingDao.getFilteredOfferings(courseId,mentorId,status);
	}

	@Override
	public List<RDCourseOfferingSummaryDTO> getOfferingsByParentId(Integer parentId) {
		return rdCourseOfferingDao.getOfferingsByParentId(parentId);
	}
	
}
