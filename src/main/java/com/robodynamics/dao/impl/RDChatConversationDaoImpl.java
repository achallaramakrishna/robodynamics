package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDChatConversationDao;
import com.robodynamics.dto.RDChatInboxDTO;
import com.robodynamics.model.RDChatConversation;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public class RDChatConversationDaoImpl implements RDChatConversationDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public RDChatConversation findById(Long conversationId) {
        return sessionFactory.getCurrentSession()
                .get(RDChatConversation.class, conversationId);
    }

    @Override
    public Long save(RDChatConversation conversation) {
        return (Long) sessionFactory.getCurrentSession().save(conversation);
    }

    @Override
    public RDChatConversation findDirectConversation(Integer userA, Integer userB) {
        String hql = """
            select c
            from RDChatConversation c
            where c.conversationType = 'DIRECT'
              and c.status = 'ACTIVE'
              and exists (
                  select 1 from RDChatParticipant p
                  where p.conversation = c and p.userId = :userA
              )
              and exists (
                  select 1 from RDChatParticipant p2
                  where p2.conversation = c and p2.userId = :userB
              )
            order by c.conversationId desc
        """;

        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDChatConversation.class)
                .setParameter("userA", userA)
                .setParameter("userB", userB)
                .setMaxResults(1)
                .uniqueResult();
    }

    @Override
    public List<RDChatConversation> findConversationsForUser(Integer userId) {
        String hql = """
            select distinct c
            from RDChatConversation c
            join c.participants p
            where p.userId = :userId
              and c.status = 'ACTIVE'
            order by coalesce(c.lastMessageAt, c.createdAt) desc
        """;

        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDChatConversation.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public void updateLastMessageAt(Long conversationId) {
        String hql = """
            update RDChatConversation
               set lastMessageAt = :now
             where conversationId = :cid
        """;

        sessionFactory.getCurrentSession()
                .createQuery(hql)
                .setParameter("now", new Date())
                .setParameter("cid", conversationId)
                .executeUpdate();
    }

    @Override
    public List<RDChatInboxDTO> findInboxByUser(Integer userId) {

        String hql = """
            select new com.robodynamics.dto.RDChatInboxDTO(
			    c.conversationId,
			    c.conversationType,
			    c.title,
			    case
			        when c.conversationType = 'GROUP' then c.title
			        else concat(
			            coalesce(u.firstName, ''),
			            case when u.lastName is not null then concat(' ', u.lastName) else '' end
			        )
			    end,
			    c.lastMessageAt,
			    c.createdAt
			)
			from RDChatConversation c
			join c.participants p
			join RDChatParticipant p2
			    on p2.conversation = c and p2.userId <> :userId
			join RDUser u
			    on u.userID = p2.userId
			where p.userId = :userId
			  and c.status = 'ACTIVE'
			order by coalesce(c.lastMessageAt, c.createdAt) desc
        """;

        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDChatInboxDTO.class)
                .setParameter("userId", userId)
                .getResultList();
    }

	
}
