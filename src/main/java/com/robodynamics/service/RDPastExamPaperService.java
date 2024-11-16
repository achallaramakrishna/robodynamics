package com.robodynamics.service;

import org.springframework.web.multipart.MultipartFile;

import com.robodynamics.model.RDPastExamPaper;

import java.io.IOException;
import java.util.List;

public interface RDPastExamPaperService {
	
	List<Integer> getDistinctYears();
    List<String> getExamList();
    List<RDPastExamPaper> findExamPapersByFilters(Integer year, Integer examId);
    
    RDPastExamPaper findExamPaperById(int examPaperId);

	void processJsonFile(MultipartFile jsonFile) throws IOException;
}
