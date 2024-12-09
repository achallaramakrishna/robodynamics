package com.robodynamics.service;

import com.robodynamics.model.RDExam;
import java.util.List;

public interface RDExamService {
    void saveExam(RDExam exam);
    RDExam getExamById(int id);
    List<RDExam> getAllExams();
    List<RDExam> getExamsByYear(int examYear);
    void updateExam(RDExam exam);
    void deleteExamById(int id);
    List<RDExam> getAllExamsWithTargetDates();

}
