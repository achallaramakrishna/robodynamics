package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCourseSessionDetail;

public interface RDCourseSessionDetailDao {
	
	public void saveRDCourseSession(RDCourseSessionDetail rdCourseSessionDetail);

	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId);
	
	public List < RDCourseSessionDetail > getRDCourseSessionDetails();
	
    public void deleteRDCourseSessionDetail(int id);
}
