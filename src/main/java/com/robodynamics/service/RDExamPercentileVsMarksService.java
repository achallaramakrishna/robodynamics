package com.robodynamics.service;

import com.robodynamics.model.RDExamPercentileVsMarks;

import java.util.List;

public interface RDExamPercentileVsMarksService {
    void savePercentileVsMarks(RDExamPercentileVsMarks percentileVsMarks);
    RDExamPercentileVsMarks getPercentileVsMarksById(int id);
    List<RDExamPercentileVsMarks> getPercentileVsMarksByExamId(int examId);
    List<RDExamPercentileVsMarks> getAllPercentileVsMarks();
    void updatePercentileVsMarks(RDExamPercentileVsMarks percentileVsMarks);
    void deletePercentileVsMarksById(int id);
}
