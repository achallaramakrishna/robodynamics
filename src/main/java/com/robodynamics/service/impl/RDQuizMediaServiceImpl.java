// src/main/java/com/robodynamics/service/impl/RDQuizMediaServiceImpl.java
package com.robodynamics.service.impl;

import com.robodynamics.dao.RDQuizOptionDao;
import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.dto.OptionDTO;
import com.robodynamics.dto.QuestionViewDTO;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.service.QuizMediaStorage;
import com.robodynamics.service.RDQuizMediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MultiValueMap;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RDQuizMediaServiceImpl implements RDQuizMediaService {

    @Autowired private RDQuizQuestionDao questionDao;
    @Autowired private RDQuizOptionDao   optionDao;
    @Autowired private QuizMediaStorage  storage;

    @Override
    @Transactional(readOnly = true)
    public QuestionViewDTO getQuestionView(int questionId) {
        RDQuizQuestion q = questionDao.findById(questionId);
        if (q == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found: " + questionId);
        }

        QuestionViewDTO dto = new QuestionViewDTO();
        dto.setQuestionId(q.getQuestionId());
        dto.setQuestionText(q.getQuestionText());
        dto.setQuestionImage(q.getQuestionImage());

        List<OptionDTO> options = new ArrayList<>();
        if (q.getOptions() != null) {
            for (RDQuizOption o : q.getOptions()) {
               OptionDTO od = new OptionDTO();
                od.setOptionId(o.getOptionId());
                od.setOptionText(o.getOptionText());
                od.setOptionImage(o.getOptionImage());
                od.setCorrect(o.isCorrect());
                options.add(od);
            }
        }
        dto.setOptions(options);
        return dto;
    }

    @Override
    @Transactional
    public void uploadForQuestion(int questionId,
                                  Integer quizId,
                                  MultipartFile questionImageFile,
                                  Boolean clearQuestionImage,
                                  MultiValueMap<String, MultipartFile> optionFilesMap,
                                  Map<String, String> paramMap) {
        RDQuizQuestion q = questionDao.findById(questionId);
        if (q == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question not found: " + questionId);
        }

        int quizFolder = (quizId == null ? 0 : quizId);

        // Question image
        if (Boolean.TRUE.equals(clearQuestionImage)) {
            q.setQuestionImage(null);
        } else if (questionImageFile != null && !questionImageFile.isEmpty()) {
            assertImage(questionImageFile, 3 * 1024 * 1024);
            try {
                String url = storage.storeQuestionImage(quizFolder, q.getQuestionId(), questionImageFile);
                q.setQuestionImage(url);
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store question image", e);
            }
        }
        questionDao.saveOrUpdate(q);

        // Options: expect fields like optionImageFiles[<optionId>] and clearOptionImage[<optionId>]
        if (optionFilesMap != null) {
            for (String key : optionFilesMap.keySet()) {
                if (!key.startsWith("optionImageFiles[")) continue;
                Integer optionId = extractId(key);
                MultipartFile file = optionFilesMap.getFirst(key);
                if (optionId == null) continue;

                RDQuizOption opt = optionDao.findById(optionId);
                if (opt == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Option not found: " + optionId);
                }

                boolean clear = false;
                if (paramMap != null) {
                    String clearKey = "clearOptionImage[" + optionId + "]";
                    String v = paramMap.get(clearKey);
                    clear = "on".equalsIgnoreCase(v) || "true".equalsIgnoreCase(v);
                }

                if (clear) {
                    opt.setOptionImage(null);
                } else if (file != null && !file.isEmpty()) {
                    assertImage(file, 2 * 1024 * 1024);
                    try {
                        String url = storage.storeOptionImage(quizFolder, q.getQuestionId(), opt.getOptionId(), file);
                        opt.setOptionImage(url);
                    } catch (IOException e) {
                        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store option image", e);
                    }
                }
                optionDao.saveOrUpdate(opt);
            }
        }
    }

    // helpers
    private Integer extractId(String key) {
        int l = key.indexOf('['), r = key.indexOf(']');
        if (l >= 0 && r > l) {
            try { return Integer.parseInt(key.substring(l+1, r)); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    private void assertImage(MultipartFile f, long maxBytes) {
        String ctype = f.getContentType();
        if (ctype == null || !(ctype.equals("image/png") || ctype.equals("image/jpeg") || ctype.equals("image/webp"))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PNG/JPEG/WEBP allowed");
        }
        if (f.getSize() > maxBytes) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Image too large");
        }
    }
}
