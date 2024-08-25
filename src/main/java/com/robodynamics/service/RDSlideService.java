package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.model.RDSlide;

public interface RDSlideService {

	public void saveRDSlide(RDSlide slide);
    
    public List<RDSlide> getAllSlides();
    
    public RDSlide getSlideById(int slideId);
    
    List<RDSlide> getSlidesBySessionDetailId(int sessionId);
    
  
    
}
