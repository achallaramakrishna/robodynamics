package com.robodynamics.service;

import com.robodynamics.model.RDLabManual;
import java.util.List;

public interface RDLabManualService {
    Integer uploadLabManual(String labManualJson, Integer createdBy);
    RDLabManual getById(Integer labManualId);
    List<RDLabManual> listBySessionDetail(Integer sessionDetailId);
    List<RDLabManual> listBySessionId(Integer courseSessionId);
    void delete(Integer labManualId);
}
