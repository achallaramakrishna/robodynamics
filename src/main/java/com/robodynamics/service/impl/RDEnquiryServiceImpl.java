package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDEnquiryDao;
import com.robodynamics.model.RDEnquiry;
import com.robodynamics.service.RDEnquiryService;

@Service
public class RDEnquiryServiceImpl implements RDEnquiryService {

	@Autowired
	private RDEnquiryDao rdEnquiryDao;

	@Override
	@Transactional
	public void saveRDEnquiry(RDEnquiry rdEnquiry) {
		rdEnquiryDao.saveRDEnquiry(rdEnquiry);
		
	}

	@Override
	@Transactional
	public RDEnquiry getRDEnquiry(int enquiryId) {
		return rdEnquiryDao.getRDEnquiry(enquiryId);
	}

	@Override
	@Transactional
	public List<RDEnquiry> getRDEnquiries() {
		return rdEnquiryDao.getRDEnquiries();
	}

	@Override
	@Transactional
	public void deleteRDEnquiry(int id) {
		rdEnquiryDao.deleteRDEnquiry(id);
		
	}

}
