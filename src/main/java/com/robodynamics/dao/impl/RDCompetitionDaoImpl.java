
package com.robodynamics.dao.impl;

import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDCompetitionDao;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDCompetition;

@Repository
@Transactional
public class RDCompetitionDaoImpl implements RDCompetitionDao {

	@Autowired
	private SessionFactory factory;
	
	@Override
	public void saveRDCompetition(RDCompetition rdCompetition) {
		
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdCompetition);

	}

	@Override
	public RDCompetition getRDCompetition(int competitionId) {
		
		Session session = factory.getCurrentSession();
        RDCompetition competition = session.get(RDCompetition.class, competitionId);
        return competition;
	}
	

	@Override
	public List<RDCompetition> getRDCompetitions() {
		Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDCompetition > cq = cb.createQuery(RDCompetition.class);
        Root < RDCompetition > root = cq.from(RDCompetition.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
	}

	@Override
	public void deleteRDCompetition(int id) {
		Session session = factory.getCurrentSession();
		RDCompetition competition = session.byId(RDCompetition.class).load(id);
        session.delete(competition);

	}

}
