package com.robodynamics.dao.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDMarketingMessageLogDao;
import com.robodynamics.model.RDMarketingMessageLog;

@Repository
@Transactional
public class RDMarketingMessageLogDaoImpl implements RDMarketingMessageLogDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDMarketingMessageLog save(RDMarketingMessageLog log) {
        Session session = sessionFactory.getCurrentSession();
        session.save(log);
        return log;
    }

    @Override
    public List<RDMarketingMessageLog> findRecentByLeadId(Long leadId, int limit) {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery(
                        "from RDMarketingMessageLog m where m.lead.id = :leadId order by m.createdAt desc",
                        RDMarketingMessageLog.class)
                .setParameter("leadId", leadId)
                .setMaxResults(limit)
                .list();
    }

    @Override
    public long countByDirectionAndRange(String direction, LocalDateTime from, LocalDateTime toExclusive) {
        Session session = sessionFactory.getCurrentSession();
        Long count = session.createQuery(
                        "select count(m.msgId) from RDMarketingMessageLog m " +
                                "where m.direction = :direction and m.createdAt >= :from and m.createdAt < :toExclusive",
                        Long.class)
                .setParameter("direction", direction)
                .setParameter("from", from)
                .setParameter("toExclusive", toExclusive)
                .uniqueResult();
        return count == null ? 0L : count;
    }
}
