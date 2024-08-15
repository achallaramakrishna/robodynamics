package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDSubmissionDao;
import com.robodynamics.model.RDCompetitionParticipant;
import com.robodynamics.model.RDSubmission;

@Repository
@Transactional
public class RDSubmissionDaoImpl implements RDSubmissionDao {
	
	@Autowired
	private SessionFactory factory;


	@Override
	public List<RDSubmission> findByCompetitionId(int competitionId) {
		
		Session session = factory.getCurrentSession();
		
		Query query = session.createQuery("from RDSubmission submission where submission.competition.competitionId = :id");
		
		query.setInteger("id", competitionId);

		List<RDSubmission> submissions = query.list();
		
		return submissions;
	}

	@Override
	public List<RDSubmission> findByUserId(int userId) {
Session session = factory.getCurrentSession();
		
		Query query = session.createQuery("from RDSubmission submission where submission.user.userId = :id");
		
		query.setInteger("id", userId);

		List<RDSubmission> submissions = query.list();
		
		return submissions;

	}

	@Override
	public void saveRDSubmission(RDSubmission submission) {
		
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(submission);
		
	}

}
