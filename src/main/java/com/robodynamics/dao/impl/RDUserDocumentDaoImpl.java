package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDUserDocumentDao;
import com.robodynamics.model.RDUserDocument;
import com.robodynamics.model.RDUserDocument.DocType;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Repository
@Transactional
public class RDUserDocumentDaoImpl implements RDUserDocumentDao {

  @Resource private SessionFactory sessionFactory;

  @Override
  public void save(RDUserDocument doc) {
    sessionFactory.getCurrentSession().save(doc);
  }

  @Override
  public RDUserDocument findById(int docId) {
    return sessionFactory.getCurrentSession().get(RDUserDocument.class, docId);
  }

  @Override
  public List<RDUserDocument> findByUserId(int userId) {
    return sessionFactory.getCurrentSession().createQuery(
        "from RDUserDocument d where d.user.userId = :uid order by d.docId desc",
        RDUserDocument.class)
      .setParameter("uid", userId)
      .getResultList();
  }

  @Override
  public RDUserDocument findLatestResume(int userId) {
    return sessionFactory.getCurrentSession().createQuery(
        "from RDUserDocument d where d.user.userId = :uid and d.docType = :t order by d.docId desc",
        RDUserDocument.class)
      .setParameter("uid", userId)
      .setParameter("t", DocType.RESUME)
      .setMaxResults(1)
      .uniqueResult();
  }

  @Override
  public void delete(int docId) {
    var s = sessionFactory.getCurrentSession();
    RDUserDocument d = s.get(RDUserDocument.class, docId);
    if (d != null) s.delete(d);
  }
}
