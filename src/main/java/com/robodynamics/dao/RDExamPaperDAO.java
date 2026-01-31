package com.robodynamics.dao;

import java.util.List;
import java.util.Map;

import com.robodynamics.model.RDExamPaper;

public interface RDExamPaperDAO {

    void save(RDExamPaper paper);

    List<Map<String, Object>> findBySessionDetail(Integer sessionDetailId);

    RDExamPaper getExamPaperWithDetails(Integer examPaperId);

    void delete(Integer examPaperId);
}
