package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamCourse;
import com.robodynamics.model.RDPastExamPaper;
import com.robodynamics.model.RDQuizOption;
import com.robodynamics.model.RDQuizQuestion;

public interface RDPastExamPaperDao {

		List<Integer> getDistinctYears();
	    List<String> getExamList();
	    List<RDPastExamPaper> findExamPapersByFilters(Integer year, Integer examId);
	    RDPastExamPaper findExamPaperById(int examPaperId);
        void savePastExamPaper(RDPastExamPaper pastExamPaper);
	    void saveExamCourse(RDExamCourse examCourse);
	    void saveQuizQuestion(RDQuizQuestion question);
	    void saveQuizOption(RDQuizOption option);
}
