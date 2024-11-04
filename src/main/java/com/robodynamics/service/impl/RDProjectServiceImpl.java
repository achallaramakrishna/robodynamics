package com.robodynamics.service.impl;

import java.io.InputStream;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDProjectDao;
import com.robodynamics.model.RDProject;
import com.robodynamics.service.RDProjectService;

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
	public List<RDProject> getProjectsByGradeRange() {
		return rdProjectDao.getProjectsByGradeRange();
	}

	@Override
    @Transactional
	public List<RDProject> getProjectsByCategory() {
		return rdProjectDao.getProjectsByCategory();
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
}
