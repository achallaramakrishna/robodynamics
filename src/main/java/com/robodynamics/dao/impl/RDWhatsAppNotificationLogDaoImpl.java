package com.robodynamics.dao.impl;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDWhatsAppNotificationLogDao;
import com.robodynamics.model.RDWhatsAppNotificationLog;

@Repository
@Transactional
public class RDWhatsAppNotificationLogDaoImpl implements RDWhatsAppNotificationLogDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void save(RDWhatsAppNotificationLog log) {
        Session session = sessionFactory.getCurrentSession();
        session.save(log);
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDWhatsAppNotificationLog> findAll() {
        Session session = sessionFactory.getCurrentSession();
        Query<RDWhatsAppNotificationLog> query =
                session.createQuery("FROM RDWhatsAppNotificationLog ORDER BY sentTime DESC");
        return query.list();
    }

    @Override
    @SuppressWarnings("unchecked")
    public List<RDWhatsAppNotificationLog> findByStatus(String status) {
        Session session = sessionFactory.getCurrentSession();
        Query<RDWhatsAppNotificationLog> query =
                session.createQuery("FROM RDWhatsAppNotificationLog WHERE status = :status ORDER BY sentTime DESC");
        query.setParameter("status", status);
        return query.list();
    }
    
    @Override
    public boolean existsForToday(int offeringId, String phoneNumber, String messageType) {
        Session session = sessionFactory.getCurrentSession();
        Query<Long> query = session.createQuery(
            "SELECT COUNT(l) FROM RDWhatsAppNotificationLog l " +
            "WHERE l.phoneNumber = :phone AND l.messageType = :type " +
            "AND DATE(l.sentTime) = CURRENT_DATE " +
            "AND l.messageContent LIKE :offeringId", Long.class);
        query.setParameter("phone", phoneNumber);
        query.setParameter("type", messageType);
        query.setParameter("offeringId", "%" + offeringId + "%");
        return query.uniqueResult() > 0;
    }

}
