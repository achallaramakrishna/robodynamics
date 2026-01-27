package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDMatchPair;

public interface RDMatchPairDAO {

    void save(RDMatchPair pair);

    RDMatchPair findById(int id);

    List<RDMatchPair> findByQuestionId(int matchQuestionId);

    void delete(int pairId);

	void deleteByQuestionId(int matchQuestionId);

	int findCourseIdByMatchPairId(int matchPairId);
}
