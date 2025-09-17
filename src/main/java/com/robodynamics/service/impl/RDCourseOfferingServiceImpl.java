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
	public List<RDCourseOffering> getOfferingsIntersecting(LocalDate since, LocalDate to) {
		// TODO Auto-generated method stub
		return rdCourseOfferingDao.getCourseOfferingsByDateAndMentor(since,to);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getOfferingsForMentorIntersecting(Integer mentorId, LocalDate since, LocalDate to) {
		// TODO Auto-generated method stub
		return rdCourseOfferingDao.findOfferingsForMentorIntersecting(mentorId,since,to);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getCourseOfferingsBetween(LocalDate start, LocalDate end) {
		// TODO Auto-generated method stub
		return rdCourseOfferingDao.getCourseOfferingsBetween(start,end);
	}

	@Override
	@Transactional
	public List<RDCourseOffering> getCourseOfferingsBetweenForMentor(LocalDate start, LocalDate end,
			Integer mentorUserId) {
		// TODO Auto-generated method stub
		return rdCourseOfferingDao.getCourseOfferingsBetweenForMentor(start,end);
	}

	@Override
	public List<RDCourseOffering> getCourseOfferingsOverlapping(LocalDate from, LocalDate to) {
		java.sql.Date fromSql = (from == null) ? null : java.sql.Date.valueOf(from);
	    java.sql.Date toSql   = (to   == null) ? null : java.sql.Date.valueOf(to);
	  
		return rdCourseOfferingDao.getOverlapping(fromSql, toSql);
	}

	@Override
	public List<RDCourseOffering> getCourseOfferingsOverlappingByMentor(LocalDate from, LocalDate to,
			Integer mentorUserId) {
		java.sql.Date fromSql = (from == null) ? null : java.sql.Date.valueOf(from);
	    java.sql.Date toSql   = (to   == null) ? null : java.sql.Date.valueOf(to);
	   
		return rdCourseOfferingDao.getOverlappingByMentor(fromSql,toSql,mentorUserId);
	}

	@Override
	public List<RDCourseOffering> getRDCourseOfferingsByCourse(int courseId) {
		// TODO Auto-generated method stub
		return rdCourseOfferingDao.getRDCourseOfferingsListByCourse(courseId);
	}
	
}
