package com.robodynamics.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.model.RDSlide;

public interface RDSlideService {

	public void saveRDSlide(RDSlide slide);
    
    public List<RDSlide> getAllSlides();
    
    public RDSlide getSlideById(int slideId);
    
    List<RDSlide> getSlidesBySessionDetailId(int sessionDetailId);
    
    // Delete a slide by its ID
    public void deleteSlide(int slideId);
    
    public void processJson(MultipartFile file, int courseSessionDetailId) throws Exception;
    
  
    
}
