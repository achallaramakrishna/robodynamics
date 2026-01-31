package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamSectionQuestion;

public interface RDExamSectionQuestionDAO {

    void save(RDExamSectionQuestion question);

    void update(RDExamSectionQuestion question);

    RDExamSectionQuestion findById(Integer id);

    List<RDExamSectionQuestion> findBySection(Integer sectionId);

    void delete(Integer id);
}
