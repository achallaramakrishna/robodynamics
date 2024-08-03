package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.NoResultException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import com.robodynamics.dao.RDAssetCategoryDao;
import com.robodynamics.dao.RDEnquiryDao;
import com.robodynamics.dao.RDVisitorLogDao;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDEnquiry;
import com.robodynamics.model.RDVisitorLog;


@Repository
@Transactional
public class RDVisitorLogDaoImpl implements RDVisitorLogDao {

	@Autowired
	private SessionFactory factory;
	
	
	@Override
	public void saveRDVisitorLog(RDVisitorLog rdVisitorLog) {
		Session session = factory.getCurrentSession();
		session.saveOrUpdate(rdVisitorLog);

	}

	@Override
	public RDVisitorLog getRDVisitorLog(int visitorLogId) {
		 Session session = factory.getCurrentSession();
		 RDVisitorLog rdVisitorLog = session.get(RDVisitorLog.class, visitorLogId);
	        return rdVisitorLog;
	}

	@Override
	public List<RDVisitorLog> getRDVisitorLogs() {
		Session session = factory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery < RDVisitorLog > cq = cb.createQuery(RDVisitorLog.class);
        Root < RDVisitorLog > root = cq.from(RDVisitorLog.class);
        cq.select(root);
        Query query = session.createQuery(cq);
        return query.getResultList();
	}

	@Override
	public void deleteRDVisitorLog(int id) {
		Session session = factory.getCurrentSession();
		RDVisitorLog rdVisitorLog = session.byId(RDVisitorLog.class).load(id);
        session.delete(rdVisitorLog);
	}

}
