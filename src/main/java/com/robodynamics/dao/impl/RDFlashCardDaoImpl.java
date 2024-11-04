package com.robodynamics.dao.impl;

import java.util.List;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDFlashCardDao;
import com.robodynamics.model.RDFlashCard;

@Repository
@Transactional
public class RDFlashCardDaoImpl implements RDFlashCardDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void saveRDFlashCard(RDFlashCard rdFlashCard) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(rdFlashCard);
    }

    @Override
    public RDFlashCard getRDFlashCard(int flashCardId) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(RDFlashCard.class, flashCardId);
    }

    @Override
    public List<RDFlashCard> getFlashCardsBySetId(int flashcardSetId) {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDFlashCard> cq = cb.createQuery(RDFlashCard.class);
        Root<RDFlashCard> root = cq.from(RDFlashCard.class);
        cq.select(root).where(cb.equal(root.get("flashcardSet"), flashcardSetId));
        Query<RDFlashCard> query = session.createQuery(cq);
        return query.getResultList();
    }

    @Override
    public void deleteRDFlashCard(int id) {
        Session session = sessionFactory.getCurrentSession();
        RDFlashCard flashCard = session.byId(RDFlashCard.class).load(id);
        session.delete(flashCard);
    }
    
    @Override
    public List<RDFlashCard> getRDFlashCards() {
        Session currentSession = sessionFactory.getCurrentSession();
        Query<RDFlashCard> query = currentSession.createQuery("from RDFlashCard", RDFlashCard.class);
        return query.getResultList();
    }

	@Override
	public List<RDFlashCard> findByCourseSessionDetailId(int courseSessionDetailId) {
	       Session session = sessionFactory.getCurrentSession();
	        Query<RDFlashCard> query = session.createQuery("FROM RDFlashCard WHERE courseSessionDetailId = :courseSessionDetailId", RDFlashCard.class);
	        query.setParameter("courseSessionDetailId", courseSessionDetailId);
	        return query.getResultList();

	}
    

}
