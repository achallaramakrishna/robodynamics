package com.robodynamics.service;

import java.util.List;

import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;

public interface RDCourseSessionDetailService {

	public void saveRDCourseSessionDetail(RDCourseSessionDetail rdCourseSessionDetail);

	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId);
	
	public List < RDCourseSessionDetail > getRDCourseSessionDetails();
	
    public void deleteRDCourseSessionDetail(int id);
}
