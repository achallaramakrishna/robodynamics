package com.robodynamics.dao;

import java.util.List;
import java.util.Map;

import com.robodynamics.model.RDExamAnswerKey;
import com.robodynamics.model.RDExamPaper;
import com.robodynamics.model.RDExamSectionQuestion;

public interface RDExamPaperDAO {

    void save(RDExamPaper paper);

    RDExamPaper findBySessionDetail(Integer sessionDetailId);

    RDExamPaper getExamPaperWithDetails(Integer examPaperId);
    
    boolean hasSubmissions(Integer examPaperId);


    void delete(Integer examPaperId);

	List<RDExamPaper> findAll();

	List<RDExamAnswerKey> getAnswerKeysByExamPaper(Integer examPaperId);
	
    void update(RDExamPaper paper);

	RDExamPaper merge(RDExamPaper paper);

	List<RDExamPaper> getExamPapersBySession(Integer sessionId);

	RDExamSectionQuestion getSectionQuestionById(Integer sectionQuestionId);

}
