package com.robodynamics.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.model.RDProject;

public interface RDProjectService {
    void saveRDProject(RDProject rdProject);
    RDProject getRDProject(int projectId);
    List<RDProject> getRDProjects();
    void deleteRDProject(int projectId);
    List<RDProject> getProjectsByGradeRange();
    List<RDProject> getProjectsByCategory();
    void processJson(MultipartFile file);

}
