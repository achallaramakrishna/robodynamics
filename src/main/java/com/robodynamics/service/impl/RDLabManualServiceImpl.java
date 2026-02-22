package com.robodynamics.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.model.*;
import com.robodynamics.service.RDLabManualService;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class RDLabManualServiceImpl implements RDLabManualService {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getSession() {
        return sessionFactory.getCurrentSession();
    }

    // ---------------------------------------------------------------
    // Parse the JSON format (as in lab_manual.json) and persist hierarchy
    // ---------------------------------------------------------------
    @Override
    public Integer uploadLabManual(String labManualJson, Integer createdBy) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(labManualJson);

            RDLabManual manual = new RDLabManual();
            manual.setSessionDetailId(root.path("sessionDetailId").asInt());
            manual.setTitle(root.path("title").asText(""));
            manual.setVersion(String.valueOf(root.path("version").asInt(1)));
            manual.setDifficultyLevel(root.path("difficultyLevel").asText(""));
            manual.setEstimatedTimeMinutes(root.path("estimatedTimeMinutes").asInt(0));
            manual.setObjective(root.path("objective").asText(""));

            // Collect sections
            List<RDLabSection> sections = new ArrayList<>();
            JsonNode sectionsNode = root.path("sections");
            if (sectionsNode.isArray()) {
                for (JsonNode sNode : sectionsNode) {
                    RDLabSection section = new RDLabSection();
                    section.setTitle(sNode.path("title").asText(""));
                    section.setSectionType(sNode.path("sectionType").asText("STEP"));
                    section.setDisplayOrder(sNode.path("displayOrder").asInt(1));
                    section.setLabManual(manual);

                    List<RDLabStep> steps = new ArrayList<>();
                    JsonNode stepsNode = sNode.path("steps");
                    if (stepsNode.isArray()) {
                        for (JsonNode stNode : stepsNode) {
                            RDLabStep step = new RDLabStep();
                            step.setStepNumber(stNode.path("stepNo").asInt(1));
                            step.setHeading(stNode.path("heading").asText(""));
                            step.setInstructionHtml(stNode.path("instructionHtml").asText(""));
                            String expOut = stNode.path("expectedOutputHtml").asText("");
                            step.setExpectedOutputHtml(expOut.isEmpty() ? null : expOut);
                            step.setLabSection(section);

                            List<RDLabCodeBlock> codeBlocks = new ArrayList<>();
                            JsonNode cbNode = stNode.path("codeBlocks");
                            if (cbNode.isArray()) {
                                for (JsonNode cb : cbNode) {
                                    RDLabCodeBlock block = new RDLabCodeBlock();
                                    block.setLanguage(cb.path("language").asText("java"));
                                    block.setCodeContent(cb.path("codeContent").asText(""));
                                    block.setShowToggle(cb.path("showToggle").asBoolean(true));
                                    block.setLabStep(step);
                                    codeBlocks.add(block);
                                }
                            }
                            step.setCodeBlocks(codeBlocks);
                            steps.add(step);
                        }
                    }
                    section.setSteps(steps);
                    sections.add(section);
                }
            }
            manual.setSections(sections);

            getSession().save(manual);
            return manual.getLabManualId();

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse/upload lab manual JSON: " + e.getMessage(), e);
        }
    }

    @Override
    public RDLabManual getById(Integer labManualId) {
        return getSession().get(RDLabManual.class, labManualId);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDLabManual> listBySessionDetail(Integer sessionDetailId) {
        Query<RDLabManual> q = getSession().createQuery(
            "FROM RDLabManual WHERE sessionDetailId = :sid ORDER BY labManualId DESC",
            RDLabManual.class);
        q.setParameter("sid", sessionDetailId);
        return q.list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDLabManual> listBySessionId(Integer courseSessionId) {
        // RDLabManual.sessionDetailId maps to RDCourseSessionDetail.sessionDetailId
        // which belongs to a RDCourseSession with courseSessionId
        Query<RDLabManual> q = getSession().createQuery(
            "FROM RDLabManual lm WHERE lm.sessionDetailId IN (" +
            "  SELECT d.sessionDetailId FROM RDCourseSessionDetail d " +
            "  WHERE d.courseSession.courseSessionId = :sid" +
            ") ORDER BY lm.labManualId ASC",
            RDLabManual.class);
        q.setParameter("sid", courseSessionId);
        return q.list();
    }

    @Override
    public void delete(Integer labManualId) {
        RDLabManual manual = getSession().get(RDLabManual.class, labManualId);
        if (manual != null) {
            getSession().delete(manual);
        }
    }
}
