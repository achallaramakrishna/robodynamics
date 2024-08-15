
package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDScoreDao;
import com.robodynamics.model.RDScore;
import com.robodynamics.model.RDSubmission;

@Repository
@Transactional
public class RDScoreDaoImpl implements RDScoreDao {
	
	@Autowired
	private SessionFactory factory;

	@Override
	public List<RDScore> findBySubmissionId(int submissionId) {
		
		Session session = factory.getCurrentSession();
		
		Query query = session.createQuery("from RDScore score where score.submissionId = :id");
		
		query.setInteger("id", submissionId);

		List<RDScore> scores = query.list();
		
		return scores;
	}

	@Override
	public List<RDScore> findByJudgeUserId(int judgeUserId) {
		
		Session session = factory.getCurrentSession();
		
		Query query = session.createQuery("from RDScore score where score.judgeUser.judgeUserId = :id");
		
		query.setInteger("id", judgeUserId);

		List<RDScore> scores = query.list();
		
		return scores;
	}

}
