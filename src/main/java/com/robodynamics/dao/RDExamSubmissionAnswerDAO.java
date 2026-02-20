package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamSubmissionAnswer;

public interface RDExamSubmissionAnswerDAO {

    void save(RDExamSubmissionAnswer answer);

    void deleteBySubmissionId(Integer submissionId);

    List<RDExamSubmissionAnswer> findBySubmissionId(Integer submissionId);
}
