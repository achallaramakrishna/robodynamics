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

import com.robodynamics.dao.RDFlashCardSetDao;
import com.robodynamics.model.RDFlashCardSet;

@Repository
@Transactional
public class RDFlashCardSetDaoImpl implements RDFlashCardSetDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void saveRDFlashCardSet(RDFlashCardSet rdFlashCardSet) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(rdFlashCardSet);
    }

    @Override
    public RDFlashCardSet getRDFlashCardSet(int flashcardSetId) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(RDFlashCardSet.class, flashcardSetId);
    }

    @Override
    public List<RDFlashCardSet> getRDFlashCardSets() {
        Session session = sessionFactory.getCurrentSession();
        CriteriaBuilder cb = session.getCriteriaBuilder();
        CriteriaQuery<RDFlashCardSet> cq = cb.createQuery(RDFlashCardSet.class);
        Root<RDFlashCardSet> root = cq.from(RDFlashCardSet.class);
        cq.select(root);
        Query<RDFlashCardSet> query = session.createQuery(cq);
        return query.getResultList();
    }



    @Override
    public void deleteRDFlashCardSet(int id) {
        Session session = sessionFactory.getCurrentSession();
        RDFlashCardSet flashCardSet = session.byId(RDFlashCardSet.class).load(id);
        session.delete(flashCardSet);
    }



    @Override
    public RDFlashCardSet getFlashCardSetsByCourseSessionDetail(int courseSessionDetailId) {
        String hql = "FROM RDFlashCardSet WHERE courseSessionDetail.courseSessionDetailId = :courseSessionDetailId";
        List<RDFlashCardSet> results = sessionFactory.getCurrentSession()
                                                     .createQuery(hql, RDFlashCardSet.class)
                                                     .setParameter("courseSessionDetailId", courseSessionDetailId)
                                                     .getResultList();
        return results.isEmpty() ? null : results.get(0);
    }


}
