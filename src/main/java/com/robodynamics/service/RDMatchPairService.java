package com.robodynamics.service;

import java.util.List;
import com.robodynamics.model.RDMatchPair;

public interface RDMatchPairService {

    void saveMatchPair(RDMatchPair pair);

    RDMatchPair getMatchPair(int id);

    List<RDMatchPair> getPairsByQuestionId(int matchQuestionId);

    void deletePair(int pairId);

	void deleteByQuestionId(int matchQuestionId);

	int getCourseIdForPair(int matchPairId);
	
	
}
