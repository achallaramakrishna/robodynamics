package com.robodynamics.service;

import com.robodynamics.model.RDExamMarksVsRank;

import java.util.List;

public interface RDExamMarksVsRankService {
    void saveMarksVsRank(RDExamMarksVsRank marksVsRank);
    RDExamMarksVsRank getMarksVsRankById(int id);
    List<RDExamMarksVsRank> getMarksVsRankByExamId(int examId);
    List<RDExamMarksVsRank> getAllMarksVsRank();
    void updateMarksVsRank(RDExamMarksVsRank marksVsRank);
    void deleteMarksVsRankById(int id);
}
