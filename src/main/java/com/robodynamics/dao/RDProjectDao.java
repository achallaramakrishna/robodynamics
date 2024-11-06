package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDProject;

public interface RDProjectDao {
	
	void saveRDProject(RDProject rdProject);

	RDProject getRDProject(int projectId);

	List<RDProject> getRDProjects();

	void deleteRDProject(int projectId);

	List<RDProject> getProjectsByCategory();

	List<RDProject> getProjectsByGradeRange();
	
	List<RDProject> getFeaturedProjects();
	
	List<RDProject> searchProjects(String query);
}