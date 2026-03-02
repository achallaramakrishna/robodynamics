package com.robodynamics.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.robodynamics.dto.RDQuestionBankImportResult;
import com.robodynamics.model.RDUser;
import org.springframework.web.multipart.MultipartFile;

public interface RDQuestionBankIngestionService {

    RDQuestionBankImportResult importFromJsonFile(
            MultipartFile file,
            Integer courseId,
            Integer sessionId,
            Integer sessionDetailId,
            RDUser actor
    ) throws Exception;

    RDQuestionBankImportResult importFromJsonNode(
            JsonNode root,
            Integer courseId,
            Integer sessionId,
            Integer sessionDetailId,
            RDUser actor
    ) throws Exception;
}

