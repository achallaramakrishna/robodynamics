// src/main/java/com/robodynamics/service/RDQuizMediaService.java
package com.robodynamics.service;

import com.robodynamics.dto.QuestionViewDTO;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface RDQuizMediaService {
    QuestionViewDTO getQuestionView(int questionId);

    void uploadForQuestion(int questionId,
                           Integer quizId,
                           MultipartFile questionImageFile,
                           Boolean clearQuestionImage,
                           MultiValueMap<String, MultipartFile> optionFilesMap,
                           Map<String, String> paramMap);
}
