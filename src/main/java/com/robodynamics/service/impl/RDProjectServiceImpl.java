package com.robodynamics.service.impl;

import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDProjectDao;
import com.robodynamics.model.RDProject;
import com.robodynamics.service.RDProjectService;
import com.robodynamics.wrapper.ProjectGroup;

@Service
public class RDProjectServiceImpl implements RDProjectService {

    @Autowired
    private RDProjectDao rdProjectDao;

    @Override
    @Transactional
    public void saveRDProject(RDProject rdProject) {
        rdProjectDao.saveRDProject(rdProject);
    }

    @Override
    @Transactional
    public RDProject getRDProject(int projectId) {
        return rdProjectDao.getRDProject(projectId);
    }

    @Override
    @Transactional
    public List<RDProject> getRDProjects() {
        return rdProjectDao.getRDProjects();
    }

    @Override
    @Transactional
    public void deleteRDProject(int projectId) {
        rdProjectDao.deleteRDProject(projectId);
    }

    @Override
    @Transactional
    public List<ProjectGroup<RDProject>> getProjectsGroupedByGradeRange() {
        // Fetch all projects
        List<RDProject> projects = rdProjectDao.getRDProjects();

        // Group projects by grade range, converting the key to a String
        Map<String, List<RDProject>> projectsByGradeRange = projects.stream()
                .collect(Collectors.groupingBy(project -> project.getGradeRange().toString()));

        // Convert the map to a list of ProjectGroup objects with specified RDProject type
        return projectsByGradeRange.entrySet().stream()
                .map(entry -> new ProjectGroup<RDProject>(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ProjectGroup<RDProject>> getProjectsGroupedByCategory() {
        // Fetch all projects
        List<RDProject> projects = rdProjectDao.getRDProjects();

        // Group projects by category
        Map<String, List<RDProject>> projectsByCategory = projects.stream()
                .collect(Collectors.groupingBy(RDProject::getCategory));

        // Convert the map to a list of ProjectGroup objects with specified RDProject type
        return projectsByCategory.entrySet().stream()
                .map(entry -> new ProjectGroup<RDProject>(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }


    @Override
    @Transactional
    public void processJson(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            ObjectMapper objectMapper = new ObjectMapper();
            RDProject[] projects = objectMapper.readValue(inputStream, RDProject[].class);
            for (RDProject project : projects) {
                rdProjectDao.saveRDProject(project);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error processing JSON file: " + e.getMessage(), e);
        }
    }

	@Override
	@Transactional
	public List<RDProject> getFeaturedProjects() {
		return rdProjectDao.getFeaturedProjects();
	}


    @Override
    @Transactional
    public List<RDProject> searchProjects(String query) {
        return rdProjectDao.searchProjects(query);
    }
}
