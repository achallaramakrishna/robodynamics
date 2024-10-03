package com.robodynamics.service.impl;

import com.robodynamics.dao.RDAssignmentDao;
import com.robodynamics.model.RDAssignment;
import com.robodynamics.service.RDAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class RDAssignmentServiceImpl implements RDAssignmentService {

    @Autowired
    private RDAssignmentDao assignmentDao;

    @Override
    public RDAssignment getAssignmentById(int assignmentId) {
        return assignmentDao.getAssignmentById(assignmentId);
    }

    @Override
    public List<RDAssignment> getAssignmentsByCourseSessionDetailId(int courseSessionDetailId) {
        return assignmentDao.getAssignmentsByCourseSessionDetailId(courseSessionDetailId);
    }

    @Override
    public void saveAssignment(RDAssignment assignment) {
        assignmentDao.saveAssignment(assignment);
    }

    @Override
    public void updateAssignment(RDAssignment assignment) {
        assignmentDao.updateAssignment(assignment);
    }

    @Override
    public void deleteAssignment(int assignmentId) {
        assignmentDao.deleteAssignment(assignmentId);
    }

	@Override
	public List<RDAssignment> getAllAssignments() {
		
		return assignmentDao.getAllAssignments();
	}
}
