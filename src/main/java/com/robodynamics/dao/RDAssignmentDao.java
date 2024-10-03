package com.robodynamics.dao;

import com.robodynamics.model.RDAssignment;
import java.util.List;

public interface RDAssignmentDao {
    RDAssignment getAssignmentById(int assignmentId);
    List<RDAssignment> getAssignmentsByCourseSessionDetailId(int courseSessionDetailId);
    void saveAssignment(RDAssignment assignment);
    void updateAssignment(RDAssignment assignment);
    void deleteAssignment(int assignmentId);
	List<RDAssignment> getAllAssignments();
}
