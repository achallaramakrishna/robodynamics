package com.robodynamics.service;

import java.util.List;
import java.util.Map;

import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDUser;
import com.robodynamics.dto.RDExamPaperUploadDTO;

public interface RDExamPaperService {

    /* Upload & persist exam paper from JSON */
    void createExamPaperFromJson(
            RDExamPaperUploadDTO dto,
            Integer courseSessionId,
            Integer courseSessionDetailId,
            RDUser createdBy
    );

    /* Fetch papers for selected session detail (AJAX list) */
    List<Map<String, Object>> getExamPapersBySessionDetail(Integer sessionDetailId);

    /* View paper with sections & questions */
    RDExamPaper getExamPaperWithDetails(Integer examPaperId);

    /* Delete exam paper */
    void deleteExamPaper(Integer examPaperId);
}
