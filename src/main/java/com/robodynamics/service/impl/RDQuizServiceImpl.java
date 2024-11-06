package com.robodynamics.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDQuizDao;
import com.robodynamics.dao.RDQuizQuestionMapDao;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.service.RDQuizQuestionMapService;
import com.robodynamics.service.RDQuizQuestionService;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.wrapper.ProjectGroup;

@Service
public class RDQuizServiceImpl implements RDQuizService {

    @Autowired
    private RDQuizDao rdQuizDao;
    
    @Autowired
    private RDQuizQuestionMapService quizQuestionMapService;
    
    @Autowired
    private RDQuizQuestionService quizQuestionService;
    
    @Autowired
    private RDQuizQuestionMapDao quizQuestionMapDao;

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
        // Fetch the quiz based on quizId
        RDQuiz quiz = findById(quizId);
        if (quiz == null) {
            return false; // Quiz not found
        }

        // Fetch the question IDs mapped to this quiz using RDQuizQuestionMap
        List<Integer> questionIds = quizQuestionMapService.findQuestionIdsByQuizId(quizId);

        // Fetch the actual questions using the question IDs
        List<RDQuizQuestion> quizQuestions = quizQuestionService.findQuestionsByIds(questionIds);

        if (quizQuestions.isEmpty()) {
            return false; // No questions found for the quiz
        }

        int correctAnswers = 0;

        // Loop through the questions and compare the selected answers with correct ones
        for (RDQuizQuestion question : quizQuestions) {
            int correctOptionId = question.getCorrectOption().getOptionId();  // Assuming you have a method to get the correct option
            int selectedOptionId = selectedAnswers.getOrDefault(question.getQuestionId(), -1);

            // Increment correctAnswers count if the user selected the correct option
            if (correctOptionId == selectedOptionId) {
                correctAnswers++;
            }
        }

        // Define passing criteria (e.g., 70% correct answers to pass)
        double passingScore = 0.7;
        double score = (double) correctAnswers / quizQuestions.size();

        // Return whether the user passed the quiz based on the score
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

    @Override
    @Transactional
    public void addQuestionToQuiz(int quizId, int questionId) {
        quizQuestionMapDao.addQuestionToQuiz(quizId, questionId);
    }	
    
    @Override
    @Transactional
    public List<RDQuiz> getQuizzesFiltered(Integer courseId, String status, String difficultyLevel) {
        return rdQuizDao.findQuizzesByFilters(courseId, status, difficultyLevel);
    }

	@Override
	@Transactional
	public List<RDQuiz> getPaginatedQuizzes(int page, int size) {
		 return rdQuizDao.getPaginatedQuizzes(page, size);
	}

	@Override
	@Transactional
	public long getTotalQuizzesCount() {
		return rdQuizDao.getTotalQuizzesCount();
	}

	@Override
	@Transactional
	public List<ProjectGroup<RDQuiz>> getQuizzesGroupedByCategory() {
		return rdQuizDao.getQuizzesGroupedByCategory();
	}

	@Override
	@Transactional
	public List<ProjectGroup<RDQuiz>> getQuizzesGroupedByGradeRange() {
		return rdQuizDao.getQuizzesGroupedByGradeRange();
	}

	@Override
	@Transactional
	public List<RDQuiz> getFeaturedQuizzes() {
		return rdQuizDao.getFeaturedQuizzes();
	}
	
    @Override
    @Transactional
    public List<RDQuiz> searchQuizzes(String query) {
        return rdQuizDao.searchQuizzes(query);
    }
    
}
