	
package com.robodynamics.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDSlideDao;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.model.RDSlide;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDSlideService;


@Service
public class RDSlideServiceImpl implements RDSlideService {

	@Autowired
	RDSlideDao rdSlideDao;
	
	@Autowired
	RDCourseSessionDetailService courseSessionDetailService;
	
	
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

	public void deleteSlide(int slideId) {
		
		rdSlideDao.deleteSlide(slideId);
	}

	@Override
	public void processJson(MultipartFile file, int selectedCourseSessionDetailId) throws Exception {
	    ObjectMapper objectMapper = new ObjectMapper();
	    try {
	        // Read JSON into a list of RDSlide objects
	        List<RDSlide> slidesFromJson = objectMapper.readValue(file.getInputStream(), new TypeReference<List<RDSlide>>() {});

	        // Fetch existing slides for the course session detail
	        List<RDSlide> existingSlides = rdSlideDao.getSlidesBySessionDetailId(selectedCourseSessionDetailId);

		     // Assuming 'slides' is a List<RDSlide>, you want to map slide numbers to the corresponding RDSlide objects:
		        Map<Integer, RDSlide> existingSlidesMap = existingSlides.stream()
		            .collect(Collectors.toMap(RDSlide::getSlideNumber, slide -> slide));



	        List<RDSlide> slidesToSave = new ArrayList<>();

	        // Iterate through slides from the JSON file
	        for (RDSlide slideFromJson : slidesFromJson) {
	            RDSlide slide;

	            // Check if slide_number exists in the database
	            if (existingSlidesMap.containsKey(slideFromJson.getSlideNumber())) {
	                // Update the existing slide
	                slide = existingSlidesMap.get(slideFromJson.getSlideNumber());
	                slide.setTitle(slideFromJson.getTitle());
	                slide.setContent(slideFromJson.getContent());
	                slide.setFileUrl(slideFromJson.getFileUrl());
	                slide.setFileType(slideFromJson.getFileType());
	                slide.setSlideOrder(slideFromJson.getSlideOrder());
	            } else {
	                // Create a new slide if it doesn't exist
	                slide = new RDSlide();
	                slide.setSlideNumber(slideFromJson.getSlideNumber());
	                slide.setTitle(slideFromJson.getTitle());
	                slide.setContent(slideFromJson.getContent());
	                slide.setFileUrl(slideFromJson.getFileUrl());
	                slide.setFileType(slideFromJson.getFileType());
	                slide.setSlideOrder(slideFromJson.getSlideOrder());


	                // Set the course session detail association
	                RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(selectedCourseSessionDetailId);
	                slide.setCourseSessionDetail(courseSessionDetail);
	            }

	            slidesToSave.add(slide);
	        }

	        // Save all the slides (both new and updated)
	        rdSlideDao.saveAll(slidesToSave);

	    } catch (Exception e) {
	        throw new Exception("Error processing JSON file: " + e.getMessage());
	    }
	}

	@Override
	@Transactional
	public RDSlide findByCourseSessionDetailIdAndSlideNumber(int courseSessionDetailId, int slideNumber) {
        // Call the DAO method to fetch the slide
        return rdSlideDao.findByCourseSessionDetailIdAndSlideNumber(courseSessionDetailId, slideNumber);

	}


	
}
