package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDLeadDao;
import com.robodynamics.model.RDLead;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class RDLeadDaoImpl implements RDLeadDao {

    private final SessionFactory sessionFactory;

    public RDLeadDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    private Session s() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public RDLead save(RDLead lead) {
        if (lead.getId() == null) {
            s().save(lead);
            return lead;
        } else {
            s().update(lead); // or s().merge(lead)
            return lead;
        }
    }

    @Override
    public Optional<RDLead> findById(Long id) {
        return Optional.ofNullable(s().get(RDLead.class, id));
    }

    @Override
    public List<RDLead> findRecent(int limit) {
        return s().createQuery("from RDLead l order by l.createdAt desc", RDLead.class)
                  .setMaxResults(limit)
                  .list();
    }

    @Override
    public List<RDLead> findByStatus(String status, int limit) {
        return s().createQuery("from RDLead l where l.status = :status order by l.createdAt desc", RDLead.class)
                  .setParameter("status", status)
                  .setMaxResults(limit)
                  .list();
    }

    @Override
    public void updateStatus(Long id, String status) {
        RDLead l = s().get(RDLead.class, id);
        if (l != null) {
        	l.setStatus(RDLead.Status.fromDb(status));
            s().update(l);
        }
    }

	@Override
	public RDLead findByPhone(String phone) {
		return s()
	            .createQuery("from RDLead where phone = :phone", RDLead.class)
	            .setParameter("phone", phone)
	            .uniqueResult();
	}

	@Override
	public RDLead saveOrUpdate(RDLead lead) {
		s().saveOrUpdate(lead);
        return lead;

	}
	
	@Override
	public Optional<RDLead> findByPhoneAndAudience(String phone, RDLead.Audience audience) {
	    RDLead l = sessionFactory.getCurrentSession()
	        .createQuery("from RDLead where phone = :p and audience = :a", RDLead.class)
	        .setParameter("p", phone)
	        .setParameter("a", audience)
	        .setMaxResults(1)
	        .uniqueResult();
	    return Optional.ofNullable(l);
	}



	@Override
	public List<RDLead> getAllLeads() {
        return sessionFactory.getCurrentSession().createQuery("FROM RDLead", RDLead.class).getResultList();

	}
	
	@Override
    public RDLead getLeadById(Long id) {
        return sessionFactory.getCurrentSession().get(RDLead.class, id);
    }

	@Override
	public void deleteLead(Long id) {
		RDLead lead = getLeadById(id);
        if (lead != null) {
            sessionFactory.getCurrentSession().delete(lead);
        }
		
	}
}
