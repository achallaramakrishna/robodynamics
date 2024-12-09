package com.robodynamics.dao;

import com.robodynamics.model.RDExamMarksVsRank;

import java.util.List;

public interface RDExamMarksVsRankDao {
    void save(RDExamMarksVsRank marksVsRank);
    RDExamMarksVsRank findById(int id);
    List<RDExamMarksVsRank> findByExamId(int examId);
    List<RDExamMarksVsRank> findAll();
    void update(RDExamMarksVsRank marksVsRank);
    void deleteById(int id);
}
