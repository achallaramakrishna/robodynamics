package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDExamSection;

public interface RDExamSectionDAO {

    void save(RDExamSection section);

    void update(RDExamSection section);

    RDExamSection findById(Integer sectionId);

    List<RDExamSection> findByExamPaper(Integer examPaperId);

    void delete(Integer sectionId);
}
