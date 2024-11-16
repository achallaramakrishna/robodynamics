package com.robodynamics.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDExamCourseDao;
import com.robodynamics.dao.RDPastExamPaperDao;
import com.robodynamics.dao.RDQuizOptionDao;
import com.robodynamics.dao.RDQuizQuestionDao;
import com.robodynamics.model.RDPastExamPaper;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDExamCourse;
import com.robodynamics.model.RDQuizQuestion;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionService;
import com.robodynamics.service.RDPastExamPaperService;
import com.robodynamics.wrapper.ExamCourseJson;
import com.robodynamics.wrapper.ExamPaperJson;
import com.robodynamics.wrapper.OptionJson;
import com.robodynamics.wrapper.QuestionJson;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Service
public class RDPastExamPaperServiceImpl implements RDPastExamPaperService {

	@Autowired
	private RDPastExamPaperDao pastExamPaperDao;
	
	@Autowired
	private RDCourseService courseService;
	
	@Autowired
	private RDCourseSessionService courseSessionService;
	
    @Autowired
    private RDExamCourseDao examCourseDao;

    @Autowired
    private RDQuizQuestionDao quizQuestionDao;

    @Autowired
    private RDQuizOptionDao quizOptionDao;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public void processJsonFile(MultipartFile jsonFile) throws IOException {
        ExamPaperJson examPaperJson = objectMapper.readValue(jsonFile.getInputStream(), ExamPaperJson.class);

        // Create and save RDPastExamPaper
        RDPastExamPaper pastExamPaper = new RDPastExamPaper();
        pastExamPaper.setExamName(examPaperJson.getExamName());
        pastExamPaper.setExamCode(examPaperJson.getExamCode());
        pastExamPaper.setExamYear(examPaperJson.getExamYear());
        pastExamPaper.setTotalMarks(examPaperJson.getTotalMarks());
        pastExamPaper.setExamLevel(RDPastExamPaper.ExamLevel.valueOf(examPaperJson.getExamLevel()));
        pastExamPaper.setExamInstructions(examPaperJson.getExamInstructions());
        pastExamPaper.setDescription(examPaperJson.getDescription());

        pastExamPaperDao.savePastExamPaper(pastExamPaper);

        // Process each exam course
        for (ExamCourseJson courseJson : examPaperJson.getExamCourses()) {
        	
        	RDCourse course = courseService.getRDCourse(courseJson.getCourseId());
        	
        	RDExamCourse examCourse = new RDExamCourse();
            examCourse.setPastExamPaper(pastExamPaper);
            examCourse.setCourse(course); // Assume RDCourse instance by ID
            examCourse.setSectionName(courseJson.getSectionName());
            examCourse.setTotalMarks(courseJson.getTotalMarks());

            examCourseDao.save(examCourse);

            // Process each question in the course
            for (QuestionJson questionJson : courseJson.getQuestions()) {
                
            	RDCourseSession courseSession 
            	= courseSessionService.getCourseSessionBySessionIdAndCourseId(questionJson.getSessionId(), course.getCourseId());
            	
            	RDQuizQuestion quizQuestion = new RDQuizQuestion();
            	quizQuestion.setQuestionNumber(questionJson.getQuestionNumber());
                quizQuestion.setQuestionText(questionJson.getQuestionText());
                quizQuestion.setQuestionType(questionJson.getQuestionType());
                quizQuestion.setDifficultyLevel(RDQuizQuestion.DifficultyLevel.valueOf(questionJson.getDifficultyLevel()));
                quizQuestion.setMaxMarks(questionJson.getMaxMarks());
                quizQuestion.setPoints(questionJson.getPoints());
                quizQuestion.setTierLevel(RDQuizQuestion.TierLevel.valueOf(questionJson.getTierLevel()));
                quizQuestion.setTierOrder(questionJson.getTierOrder());
                quizQuestion.setCorrectAnswer(questionJson.getCorrectAnswer());
                quizQuestion.setExplanation(questionJson.getExplanation());
                
                quizQuestion.setExamCourse(examCourse);
                quizQuestion.setCourseSession(courseSession);
                quizQuestionDao.saveOrUpdate(quizQuestion);

                // Process each option if it's a multiple-choice question
                if (questionJson.getOptions() != null) {
                    for (OptionJson optionJson : questionJson.getOptions()) {
                        RDQuizOption quizOption = new RDQuizOption();
                        quizOption.setOptionText(optionJson.getOptionText());
                        quizOption.setCorrect(optionJson.isCorrect());
                        quizOption.setSelected(optionJson.isSelected());
                        quizOption.setQuestion(quizQuestion);

                        quizOptionDao.saveOrUpdate(quizOption);
                    }
                }
            }
        }
    }

	@Override
	@Transactional
	public List<Integer> getDistinctYears() {
		return pastExamPaperDao.getDistinctYears();
	}


	@Override
	@Transactional
	public List<String> getExamList() {
		return pastExamPaperDao.getExamList();
	}


	@Override
	@Transactional	
	public List<RDPastExamPaper> findExamPapersByFilters(Integer year, Integer examId) {
		return pastExamPaperDao.findExamPapersByFilters(year, examId);
	}
	
	@Override
	@Transactional
	public RDPastExamPaper findExamPaperById(int examPaperId) {

		RDPastExamPaper pastExamPaper = pastExamPaperDao.findExamPaperById(examPaperId);

		// Initialize the lazy-loaded collection within the transaction
		if (pastExamPaper != null) {
	        Hibernate.initialize(pastExamPaper.getExamCourses());
	        pastExamPaper.getExamCourses().forEach(course -> {
	            Hibernate.initialize(course.getQuestions());
	            course.getQuestions().forEach(question -> Hibernate.initialize(question.getOptions())); // Initialize options for each question
	        });
	    }

		return pastExamPaper;

	}
}
