package com.robodynamics.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDAssetDao;
import com.robodynamics.dao.RDAssetTransactionDao;
import com.robodynamics.dao.RDCourseOfferingDao;
import com.robodynamics.dto.RDCourseOfferingDTO;
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
	@Transactional
	public List<RDCourseOfferingSummaryDTO> getOfferingsByParentId(Integer parentId) {
		return rdCourseOfferingDao.getOfferingsByParentId(parentId);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getCourseOfferingsByDateAndMentor(LocalDate selectedDate, Integer userId) {
		// TODO Auto-generated method stub
		return rdCourseOfferingDao.findOfferingsForMentorIntersecting(selectedDate,userId);
	}

	
	@Override
	@Transactional
	public List<RDCourseOffering> getOfferingsForMentorIntersecting(Integer mentorId, LocalDate since, LocalDate to) {
		// TODO Auto-generated method stub
		return rdCourseOfferingDao.getOfferingsForMentorIntersecting(mentorId,since,to);
	}

	
	

	@Override
	@Transactional
	public List<RDCourseOffering> getRDCourseOfferingsByCourse(int courseId) {
		// TODO Auto-generated method stub
		return rdCourseOfferingDao.getRDCourseOfferingsListByCourse(courseId);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getCourseOfferingsByMentor(int userID) {
		return rdCourseOfferingDao.getCourseOfferingsByMentor(userID);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getOfferingsIntersecting(LocalDate since, LocalDate to) {
		
		return rdCourseOfferingDao.getOfferingsIntersecting(since,to);
	}

	@Override
	@Transactional
	public void deactivateCourseOffering(int id) {
		rdCourseOfferingDao.deactivateCourseOffering(id);
	}

	@Override
	@Transactional
	public void activateCourseOffering(int id) {
		rdCourseOfferingDao.activateCourseOffering(id);
	}
	
	@Override
	@Transactional
	public List<RDCourseOffering> getAllRDCourseOfferings() {
	    return rdCourseOfferingDao.getAllRDCourseOfferings();
	}



	
	
	
}
