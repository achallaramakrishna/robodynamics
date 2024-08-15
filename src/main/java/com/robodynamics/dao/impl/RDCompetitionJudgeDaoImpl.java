
package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCompetitionJudgeDao;
import com.robodynamics.model.RDCompetitionJudge;

@Repository
@Transactional
public class RDCompetitionJudgeDaoImpl implements RDCompetitionJudgeDao {
	
	@Autowired
	private SessionFactory factory;


	@Override
	public List<RDCompetitionJudge> getCompetitionJudges(int competitionId) {
		Session session = factory.getCurrentSession();
		
		Query query = session.createQuery("from RDCompetitionJudge competitionJudge where competitionJudge.competition.competitionId = :id");
		
		query.setInteger("id", competitionId);

		List<RDCompetitionJudge> competitionJudges = query.list();
		
		return competitionJudges;
	}

}
