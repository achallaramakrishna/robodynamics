// src/main/java/com/robodynamics/service/QuizMediaStorage.java
package com.robodynamics.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface QuizMediaStorage {
    String storeQuestionImage(int quizId, int questionId, MultipartFile file) throws IOException;
    String storeOptionImage(int quizId, int questionId, int optionId, MultipartFile file) throws IOException;
}
