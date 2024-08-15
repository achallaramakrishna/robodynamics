package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCompetitionParticipantDao;
import com.robodynamics.model.RDCompetitionJudge;
import com.robodynamics.model.RDCompetitionParticipant;

@Repository
@Transactional
public class RDCompetitionParticipantDaoImpl implements RDCompetitionParticipantDao {

	@Autowired
	private SessionFactory factory;

	
	@Override
	public void saveRDCompetitionParticipant(RDCompetitionParticipant competitionParticipant) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(competitionParticipant);
		
	}

	@Override
	public List<RDCompetitionParticipant> getRDCompetitionParticipants(int competitionId) {
		Session session = factory.getCurrentSession();
		
		Query query = session.createQuery("from RDCompetitionParticipant competitionParticipant where competitionParticipant.competition.competitionId = :id");
		
		query.setInteger("id", competitionId);

		List<RDCompetitionParticipant> competitionParticipants = query.list();
		
		return competitionParticipants;

	}

}
