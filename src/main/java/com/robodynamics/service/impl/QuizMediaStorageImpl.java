// src/main/java/com/robodynamics/service/impl/QuizMediaStorageImpl.java
package com.robodynamics.service.impl;

import com.robodynamics.service.QuizMediaStorage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class QuizMediaStorageImpl implements QuizMediaStorage {

    // Root directory configurable in application.properties (default: uploads)
    @Value("${rd.media.root:uploads}")
    private String mediaRoot;

    @Override
    public String storeQuestionImage(int quizId, int questionId, MultipartFile file) throws IOException {
        String folder = mediaRoot + File.separator + "quiz_" + quizId + File.separator + "question_" + questionId;
        return saveFile(folder, "question_" + questionId, file);
    }

    @Override
    public String storeOptionImage(int quizId, int questionId, int optionId, MultipartFile file) throws IOException {
        String folder = mediaRoot + File.separator + "quiz_" + quizId + File.separator + "question_" + questionId + File.separator + "options";
        return saveFile(folder, "option_" + optionId, file);
    }

    private String saveFile(String folder, String prefix, MultipartFile file) throws IOException {
        Path dirPath = Paths.get(folder);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        String originalName = file.getOriginalFilename();
        String ext = (originalName != null && originalName.contains(".")) ? originalName.substring(originalName.lastIndexOf(".")) : "";
        String fileName = prefix + "_" + System.currentTimeMillis() + ext;

        Path filePath = dirPath.resolve(fileName);
        file.transferTo(filePath.toFile());

        // Return a relative path so it can be served via /uploads/** mapping
        return "/uploads/" + dirPath.getFileName() + "/" + fileName;
    }
}
