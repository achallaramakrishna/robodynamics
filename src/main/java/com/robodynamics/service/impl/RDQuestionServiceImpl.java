package com.robodynamics.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDQuestionDao;
import com.robodynamics.dao.RDQuizOptionDao;
import com.robodynamics.dto.QuestionDTO;
import com.robodynamics.dto.RDOptionDTO;
import com.robodynamics.model.RDQuestion;
import com.robodynamics.model.RDQuestion.DifficultyLevel;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDSlide;
import com.robodynamics.service.RDQuestionService;
import com.robodynamics.service.RDSlideService;

import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class RDQuestionServiceImpl implements RDQuestionService {
	
	@Autowired
	private RDSlideService slideService;

    @Autowired
    private RDQuestionDao questionDao;
    
    @Autowired
    private RDQuizOptionDao quizOptionDao;

    @Override
    public void saveOrUpdate(RDQuestion question) {
        questionDao.saveOrUpdate(question);
    }

    @Override
    public RDQuestion findById(int questionId) {
        return questionDao.findById(questionId);
    }

    @Override
    public void delete(RDQuestion question) {
        questionDao.delete(question);
    }

    @Override
    public List<RDQuestion> findRandomQuestionsByCourseAndDifficultyLevels(int courseId, List<DifficultyLevel> difficultyLevels, int limit) {
        return questionDao.findRandomQuestionsByCourseAndDifficultyLevels(courseId, difficultyLevels, limit);
    }

    @Override
    public List<RDQuestion> findRandomQuestionsBySessionAndDifficultyLevels(int sessionId, List<DifficultyLevel> difficultyLevels, int limit) {
        return questionDao.findRandomQuestionsBySessionAndDifficultyLevels(sessionId, difficultyLevels, limit);
    }

    @Override
    public List<RDQuestion> findRandomQuestionsBySessionDetailAndDifficultyLevels(int sessionDetailId, List<DifficultyLevel> difficultyLevels, int limit) {
        return questionDao.findRandomQuestionsBySessionDetailAndDifficultyLevels(sessionDetailId, difficultyLevels, limit);
    }

    @Override
    public List<RDQuestion> findQuestionsByIds(List<Integer> questionIds) {
        return questionDao.findQuestionsByIds(questionIds);
    }
    
    @Override
    public List<RDQuestion> getQuestionsBySlideId(int slideId, String questionType) {
        // Call the DAO method to get the questions filtered by slide ID and question type
        return questionDao.findQuestionsBySlideIdAndType(slideId, questionType);
    }
    
    @Override
    public List<RDQuestion> getQuestionsBySlideId(int slideId) {
        return questionDao.findBySlideId(slideId);
    }

    @Override
    public void processJson(MultipartFile file, int selectedCourseSessionDetailId) throws Exception {
        System.out.println("Questions - uploadJson 1...");
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            // Read JSON into a list of QuestionDTO objects
            List<QuestionDTO> questionsFromJson = objectMapper.readValue(file.getInputStream(), new TypeReference<List<QuestionDTO>>() {});

            // Fetch existing slides for the course session detail
            List<RDSlide> slidesForSessionDetail = slideService.getSlidesBySessionDetailId(selectedCourseSessionDetailId);

            if (slidesForSessionDetail == null || slidesForSessionDetail.isEmpty()) {
                throw new Exception("No slides found for the provided course session detail ID.");
            }

            // Map questions by questionNumber and associate with their respective slides
            Map<Integer, RDQuestion> questionMap = new HashMap<>();
            List<RDQuestion> questionsToSave = new ArrayList<>();

            for (QuestionDTO questionFromJson : questionsFromJson) {
                System.out.println("Slide Number - " + questionFromJson.getSlideNumber());
                
                // Find the corresponding slide
                RDSlide slide = slidesForSessionDetail.stream()
                    .filter(s -> s.getSlideNumber() == questionFromJson.getSlideNumber())
                    .findFirst()
                    .orElseThrow(() -> new Exception("No slide found with slide number " + questionFromJson.getSlideNumber()));
                
                RDQuestion question;

                // Check if question already exists for this slide
                RDQuestion existingQuestion = questionDao.findBySlideIdAndQuestionNumber(slide.getSlideId(), questionFromJson.getQuestionNumber());

                if (existingQuestion != null) {
                    // Update the existing question
                    question = existingQuestion;
                    question.setQuestionText(questionFromJson.getQuestionText());
                    question.setQuestionType(questionFromJson.getQuestionType());
                    question.setCorrectAnswer(questionFromJson.getCorrectAnswer());
                    
                    // Set difficulty level (assuming your JSON sends a string like "Beginner", "Intermediate", etc.)
                    question.setDifficultyLevel(RDQuestion.DifficultyLevel.valueOf(questionFromJson.getDifficultyLevel()));

                    
                    question.setPoints(questionFromJson.getPoints());

                    // Handle options (for multiple choice questions)
                    if (questionFromJson.getQuestionType().equals("multiple_choice")) {
                        question.setOptions(createOptions(questionFromJson.getOptions(), question));
                    }
                } else {
                    // Create a new question if it doesn't exist
                    question = new RDQuestion();
                    question.setQuestionNumber(questionFromJson.getQuestionNumber());
                    question.setQuestionText(questionFromJson.getQuestionText());
                    question.setQuestionType(questionFromJson.getQuestionType());
                    question.setCorrectAnswer(questionFromJson.getCorrectAnswer());
                    
                    // Set difficulty level (assuming your JSON sends a string like "Beginner", "Intermediate", etc.)
                    question.setDifficultyLevel(RDQuestion.DifficultyLevel.valueOf(questionFromJson.getDifficultyLevel()));

                    question.setPoints(questionFromJson.getPoints());
                    question.setSlide(slide);

                    // Handle options (for multiple choice questions)
                    if (questionFromJson.getQuestionType().equals("multiple_choice")) {
                        question.setOptions(createOptions(questionFromJson.getOptions(), question));
                    }
                }

                questionsToSave.add(question);
            }

            // Save all questions (both new and updated)
            questionDao.saveAll(questionsToSave);

        } catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Error processing JSON file: " + e.getMessage());
        }
    }

    // Helper method to create RDQuizOption list from DTO options
    private List<RDQuizOption> createOptions(List<RDOptionDTO> optionsDTO, RDQuestion question) {
        List<RDQuizOption> options = new ArrayList<>();
        for (RDOptionDTO optionDTO : optionsDTO) {
            RDQuizOption option = new RDQuizOption();
            option.setOptionText(optionDTO.getOptionText());
            option.setCorrect(optionDTO.isCorrect());
            option.setQuestion(question);
            options.add(option);
        }
        return options;
    }

	@Override
	public List<RDQuestion> getQuestionsByCourseSessionDetailId(int courseSessionDetailId) {
        return questionDao.getQuestionsByCourseSessionDetailId(courseSessionDetailId);
	}

	
}
 