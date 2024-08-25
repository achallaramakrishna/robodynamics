
package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDSlideDao;
import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.model.RDSlide;
import com.robodynamics.service.RDSlideService;


@Service
public class RDSlideServiceImpl implements RDSlideService {

	@Autowired
	RDSlideDao rdSlideDao;
	
	
	@Override
	@Transactional
	public void saveRDSlide(RDSlide slide) {
		
		rdSlideDao.saveRDSlide(slide);

	}

	@Override
	@Transactional
	public List<RDSlide> getAllSlides() {
		return rdSlideDao.getAllSlides();
	}

	@Override
	@Transactional
	public RDSlide getSlideById(int slideId) {
		return rdSlideDao.getSlideById(slideId);
	}

	@Override
	public List<RDSlide> getSlidesBySessionDetailId(int sessionDetailId) {
		return rdSlideDao.getSlidesBySessionDetailId(sessionDetailId);
	}

	
}
