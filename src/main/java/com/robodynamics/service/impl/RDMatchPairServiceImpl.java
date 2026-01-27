package com.robodynamics.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDMatchPairDAO;
import com.robodynamics.service.RDMatchPairService;
import com.robodynamics.model.RDMatchPair;

@Service
@Transactional
public class RDMatchPairServiceImpl implements RDMatchPairService {

    @Autowired
    private RDMatchPairDAO matchPairDAO;

    @Override
    public void saveMatchPair(RDMatchPair pair) {
        matchPairDAO.save(pair);
    }

    @Override
    public RDMatchPair getMatchPair(int id) {
        return matchPairDAO.findById(id);
    }

    @Override
    public List<RDMatchPair> getPairsByQuestionId(int matchQuestionId) {
        return matchPairDAO.findByQuestionId(matchQuestionId);
    }

    @Override
    public void deletePair(int pairId) {
        matchPairDAO.delete(pairId);
    }

	@Override
	public void deleteByQuestionId(int matchQuestionId) {
		matchPairDAO.deleteByQuestionId(matchQuestionId);
		
	}

	@Override
	public int getCourseIdForPair(int matchPairId) {
		
		return matchPairDAO.findCourseIdByMatchPairId(matchPairId);
	}
}
