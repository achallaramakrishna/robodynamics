package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDChatParticipantDao;
import com.robodynamics.model.RDChatConversation;
import com.robodynamics.model.RDChatParticipant;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class RDChatParticipantDaoImpl implements RDChatParticipantDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public void addParticipant(Long conversationId, Integer userId, boolean isAdmin) {
        RDChatConversation conv = sessionFactory.getCurrentSession()
                .get(RDChatConversation.class, conversationId);

        RDChatParticipant p = new RDChatParticipant();
        p.setConversation(conv);
        p.setUserId(userId);
        p.setAdmin(isAdmin);
        p.setActive(true);
        p.setMuted(false);
        p.setJoinedAt(new Date());

        sessionFactory.getCurrentSession().save(p);
    }

    @Override
    public boolean isParticipant(Long conversationId, Integer userId) {
        String hql = """
            select count(p.participantId)
            from RDChatParticipant p
            where p.conversation.conversationId = :cid
              and p.userId = :uid
              and p.active = true
        """;

        Long count = sessionFactory.getCurrentSession()
                .createQuery(hql, Long.class)
                .setParameter("cid", conversationId)
                .setParameter("uid", userId)
                .uniqueResult();

        return count != null && count > 0;
    }

    @Override
    public boolean isAdmin(Long conversationId, Integer userId) {
        String hql = """
            select count(p.participantId)
            from RDChatParticipant p
            where p.conversation.conversationId = :cid
              and p.userId = :uid
              and p.admin = true
        """;

        Long count = sessionFactory.getCurrentSession()
                .createQuery(hql, Long.class)
                .setParameter("cid", conversationId)
                .setParameter("uid", userId)
                .uniqueResult();

        return count != null && count > 0;
    }

    @Override
    public List<RDChatParticipant> getParticipants(Long conversationId) {
        String hql = """
            select p from RDChatParticipant p
            where p.conversation.conversationId = :cid
              and p.active = true
        """;

        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDChatParticipant.class)
                .setParameter("cid", conversationId)
                .getResultList();
    }

    @Override
    public void markRead(Long conversationId, Integer userId) {
        String hql = """
            update RDChatParticipant
               set lastReadAt = :now
             where conversation.conversationId = :cid
               and userId = :uid
        """;

        sessionFactory.getCurrentSession()
                .createQuery(hql)
                .setParameter("now", new Date())
                .setParameter("cid", conversationId)
                .setParameter("uid", userId)
                .executeUpdate();
    }

    @Override
    public void save(RDChatParticipant p) {

        // 🔴 Mandatory DB columns
        if (p.getJoinedAt() == null) {
            p.setJoinedAt(new Date());
        }
        p.setActive(true);   // NOT NULL
        p.setMuted(false);  // NOT NULL
        p.setAdmin(false);  // NOT NULL (DIRECT chat default)

        sessionFactory.getCurrentSession().save(p);
    }

}
