package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDUserConsentDao;
import com.robodynamics.model.RDUserConsent;
import com.robodynamics.model.RDUserConsent.Type;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Optional;

@Repository
@Transactional
public class RDUserConsentDaoImpl implements RDUserConsentDao {

  @Resource private SessionFactory sessionFactory;

  @Override
  public void save(RDUserConsent consent) {
    sessionFactory.getCurrentSession().save(consent);
  }

  @Override
  public Optional<RDUserConsent> latest(int userId, Type type) {
    Query<RDUserConsent> q = sessionFactory.getCurrentSession().createQuery(
        "from RDUserConsent c where c.user.userId = :uid and c.consentType = :t order by c.agreedAt desc",
        RDUserConsent.class);
    q.setParameter("uid", userId);
    q.setParameter("t", type);
    q.setMaxResults(1);
    return q.getResultStream().findFirst();
  }
}
