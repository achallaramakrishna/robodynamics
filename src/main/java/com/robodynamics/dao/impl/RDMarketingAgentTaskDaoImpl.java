package com.robodynamics.dao.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.robodynamics.dao.RDMarketingAgentTaskDao;
import com.robodynamics.model.RDMarketingAgentTask;

@Repository
@Transactional
public class RDMarketingAgentTaskDaoImpl implements RDMarketingAgentTaskDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDMarketingAgentTask saveOrUpdate(RDMarketingAgentTask task) {
        Session session = sessionFactory.getCurrentSession();
        session.saveOrUpdate(task);
        return task;
    }

    @Override
    public List<RDMarketingAgentTask> findPendingByLeadId(Long leadId) {
        Session session = sessionFactory.getCurrentSession();
        LocalDateTime now = LocalDateTime.now();
        return session.createQuery(
                        "from RDMarketingAgentTask t " +
                                "where t.lead.id = :leadId and t.taskStatus = 'PENDING' " +
                                "and (t.runAt is null or t.runAt <= :now) " +
                                "order by t.createdAt asc",
                        RDMarketingAgentTask.class)
                .setParameter("leadId", leadId)
                .setParameter("now", now)
                .list();
    }
}
