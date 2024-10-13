package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDQuiz;

public interface RDCourseSessionDetailDao {
	
	public void saveRDCourseSessionDetail(RDCourseSessionDetail rdCourseSessionDetail);

	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId);
	
	public List < RDCourseSessionDetail > getRDCourseSessionDetails(int courseId);
	
    public void deleteRDCourseSessionDetail(int id);
    
    public List<RDCourseSessionDetail> findSessionDetailsBySessionId(int sessionId);
    
 // New method for bulk saving
    public void saveAll(List<RDCourseSessionDetail> courseSessionDetailss);
    
    RDCourseSessionDetail getRDCourseSessionDetailBySessionIdAndDetailId(int courseSessionId, int sessionDetailId);

    void flushSession();

    
}
