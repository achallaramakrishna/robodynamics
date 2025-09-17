// src/main/java/com/robodynamics/dao/impl/RDNotificationDaoImpl.java
package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDNotificationDao;
import com.robodynamics.model.RDNotification;

@Repository
public class RDNotificationDaoImpl implements RDNotificationDao {

    private final SessionFactory sessionFactory;

    public RDNotificationDaoImpl(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    @Transactional
    public void save(RDNotification n) {
        sessionFactory.getCurrentSession().persist(n);
    }

    @Override
    @Transactional(readOnly = true)
    public int countUnread(int userId) {
        Long c = sessionFactory.getCurrentSession()
            .createQuery(
                "select count(n.id) " +
                "from RDNotification n " +
                "where n.user.userID = :uid and n.readAt is null",
                Long.class
            )
            .setParameter("uid", userId)
            .uniqueResult();
        return c == null ? 0 : c.intValue();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDNotification> latest(int userId, int limit) {
        return sessionFactory.getCurrentSession()
            .createQuery(
                "from RDNotification n " +
                "where n.user.userID = :uid " +
                "order by n.createdAt desc",
                RDNotification.class
            )
            .setParameter("uid", userId)
            .setMaxResults(limit)
            .list();
    }

    @Override
    @Transactional
    public void markRead(int notifId, int userId) {
        sessionFactory.getCurrentSession()
            .createQuery(
                "update RDNotification n " +
                "set n.readAt = CURRENT_TIMESTAMP " +
                "where n.id = :id and n.user.userID = :uid and n.readAt is null"
            )
            .setParameter("id", notifId)
            .setParameter("uid", userId)
            .executeUpdate();
    }

	@Override
	@Transactional
	public int countUnreadNotifications(int userId) {
		String hql = "SELECT COUNT(n) FROM RDNotification n WHERE n.user.userID = :userId AND n.read = false";
        Query query = sessionFactory.getCurrentSession().createQuery(hql);
        query.setParameter("userId", userId);
        return ((Long) query.uniqueResult()).intValue(); // Return the count as an integer

	}
}
