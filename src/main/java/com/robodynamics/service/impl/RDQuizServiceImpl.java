package com.robodynamics.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizDao;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.service.RDQuizQuestionService;
import com.robodynamics.service.RDQuizService;

@Service
public class RDQuizServiceImpl implements RDQuizService {

    @Autowired
    private RDQuizDao rdQuizDao;
    
    @Autowired
    private RDQuizQuestionService quizQuestionService;

    @Override
    @Transactional
    public void saveOrUpdate(RDQuiz quiz) {
        rdQuizDao.saveOrUpdate(quiz);
    }

    @Override
    @Transactional
    public RDQuiz findById(int quizId) {
        return rdQuizDao.findById(quizId);
    }

    @Override
    @Transactional
    public List<RDQuiz> findAll() {
        return rdQuizDao.findAll();
    }

    @Override
    @Transactional
    public void delete(RDQuiz quiz) {
        rdQuizDao.delete(quiz);
    }
    
    @Override
    public Map<Integer, Integer> processAnswers(Map<String, String> answers, List<RDQuizQuestion> quizQuestions) {
        Map<Integer, Integer> selectedAnswers = new HashMap<>();

        // Loop through quiz questions and capture user answers
        for (RDQuizQuestion question : quizQuestions) {
            String paramName = "question_" + question.getQuestionId(); // The input field names should be question_{id}
            if (answers.containsKey(paramName)) {
                int selectedOptionId = Integer.parseInt(answers.get(paramName));
                selectedAnswers.put(question.getQuestionId(), selectedOptionId);
            }
        }

        return selectedAnswers;
    }

    @Override
    public boolean evaluateQuiz(int quizId, Map<Integer, Integer> selectedAnswers) {
        RDQuiz quiz = findById(quizId);
        if (quiz == null) {
            return false; // Quiz not found
        }

        List<RDQuizQuestion> quizQuestions = quiz.getQuizQuestions();
        int correctAnswers = 0;

        // Loop through the questions and compare the selected answers with correct ones
        for (RDQuizQuestion question : quizQuestions) {
            int correctOptionId = question.getCorrectOption().getOptionId(); // Assuming you have a method to get the correct option
            int selectedOptionId = selectedAnswers.getOrDefault(question.getQuestionId(), -1);

            // Increment correctAnswers count if the user selected the correct option
            if (correctOptionId == selectedOptionId) {
                correctAnswers++;
            }
        }

        // Define passing criteria (70% correct answers to pass)
        double passingScore = 0.7;
        double score = (double) correctAnswers / quizQuestions.size();

        return score >= passingScore;
    }

    @Override
    public int calculatePoints(List<RDQuizQuestion> quizQuestions, Map<Integer, Integer> selectedAnswers) {
        int totalPoints = 0;
        int pointsPerCorrectAnswer = 10; // You can adjust this value

        // Calculate points for each correct answer
        for (RDQuizQuestion question : quizQuestions) {
            RDQuizOption correctOption = question.getCorrectOption();
            int selectedOptionId = selectedAnswers.getOrDefault(question.getQuestionId(), -1);

            if (correctOption != null && correctOption.getOptionId() == selectedOptionId) {
                totalPoints += pointsPerCorrectAnswer;
            }
        }

        return totalPoints;
    }

	
}
