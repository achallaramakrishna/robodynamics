package com.robodynamics.dao;

import com.robodynamics.model.RDExam;
import java.util.List;

public interface RDExamDao {
    void save(RDExam exam);
    RDExam findById(int id);
    List<RDExam> findAll();
    List<RDExam> findByYear(int examYear);
    void update(RDExam exam);
    void deleteById(int id);
	List<RDExam> findAllWithTargetDates();
}
