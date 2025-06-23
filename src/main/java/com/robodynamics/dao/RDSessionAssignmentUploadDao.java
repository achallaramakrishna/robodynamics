package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDSessionAssignmentUpload;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDUser;

public interface RDSessionAssignmentUploadDao {

    void saveUpload(RDSessionAssignmentUpload upload);

    RDSessionAssignmentUpload getUpload(int uploadId);

    List<RDSessionAssignmentUpload> getAllUploads();

    List<RDSessionAssignmentUpload> getUploadsByStudent(RDUser student);

    List<RDSessionAssignmentUpload> getUploadsByStudentAndSessionDetail(RDUser student, RDCourseSessionDetail sessionDetail);

    void deleteUpload(Long id);
    
    void update(RDSessionAssignmentUpload upload);

}
