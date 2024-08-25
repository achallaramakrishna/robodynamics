package com.robodynamics.dao;


import java.util.List;

import com.robodynamics.model.RDFillInBlankQuestion;
import com.robodynamics.model.RDSlide;

public interface RDSlideDao {
    
	public void saveRDSlide(RDSlide slide);
    
    public List<RDSlide> getAllSlides();
    
    public RDSlide getSlideById(int slideId);
    
    public List<RDSlide> getSlidesBySessionDetailId(int sessionDetailId);
    
}
