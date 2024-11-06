package com.robodynamics.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.model.RDProject;
import com.robodynamics.wrapper.ProjectGroup;

public interface RDProjectService {
    void saveRDProject(RDProject rdProject);
    RDProject getRDProject(int projectId);
    List<RDProject> getRDProjects();
    void deleteRDProject(int projectId);

    void processJson(MultipartFile file);
    
    List<ProjectGroup<RDProject>> getProjectsGroupedByCategory();

    List<ProjectGroup<RDProject>> getProjectsGroupedByGradeRange(); 
	
	List<RDProject> getFeaturedProjects();
	
	 List<RDProject> searchProjects(String query);
}
