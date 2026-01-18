package com.robodynamics.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDCourseSessionDetail.TierLevel;
import com.robodynamics.wrapper.CourseSessionDetailJson;
import com.robodynamics.wrapper.CourseSessionJson;

public interface RDCourseSessionDetailService {

	public void saveRDCourseSessionDetail(RDCourseSessionDetail rdCourseSessionDetail);

	public RDCourseSessionDetail getRDCourseSessionDetail(int courseSessionDetailId);
	
	public List < RDCourseSessionDetail > getRDCourseSessionDetails(int sessionId);
	
    public void deleteRDCourseSessionDetail(int id);
    
    public List<RDCourseSessionDetail> findSessionDetailsBySessionId(int sessionId);
    
	public void processSessionDetail(CourseSessionDetailJson detail, int courseSessionId, int courseId);

    List<RDCourseSessionDetail> findByTierLevel(TierLevel tierLevel);
    List<RDCourseSessionDetail> findByTierLevelOrderedByTierOrder(TierLevel tierLevel);

	public Integer countByType(int sessionId, String string);

	public List<RDCourseSessionDetail> getBySessionAndType(int sessionId, String string);
	
	List<RDCourseSessionDetail> getRDCourseSessionDetailsByCourseId(int courseId);

}
