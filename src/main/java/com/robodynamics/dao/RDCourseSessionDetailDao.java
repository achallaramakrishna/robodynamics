package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCourseSessionDetail;

public interface RDCourseSessionDetailDao {
	
	public void saveRDCourseSession(RDCourseSessionDetail rdCourseSessionDetail);

	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId);
	
	public List < RDCourseSessionDetail > getRDCourseSessionDetails(int courseId);
	
    public void deleteRDCourseSessionDetail(int id);
}
