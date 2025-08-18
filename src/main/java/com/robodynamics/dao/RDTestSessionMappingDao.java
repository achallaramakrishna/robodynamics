// com.robodynamics.dao.RDTestSessionMappingDao
package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.*;

public interface RDTestSessionMappingDao {
    void save(RDTestSession link);
    void delete(Integer testId, Integer courseSessionId);
    void deleteByTestId(Integer testId);
    boolean exists(Integer testId, Integer courseSessionId);
    List<RDTestSession> findByTestId(Integer testId);
}
