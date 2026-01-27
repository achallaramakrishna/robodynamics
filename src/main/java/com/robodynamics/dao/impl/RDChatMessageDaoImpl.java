package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDChatMessageDao;
import com.robodynamics.dto.RDChatMessageDTO;
import com.robodynamics.model.RDChatConversation;
import com.robodynamics.model.RDChatMessage;
import com.robodynamics.model.RDUser;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Repository
public class RDChatMessageDaoImpl implements RDChatMessageDao {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public Long save(RDChatMessage message) {
        message.setCreatedAt(new Date());
        return (Long) sessionFactory.getCurrentSession().save(message);
    }

    @Override
    public List<RDChatMessage> getRecentMessages(Long conversationId, int limit) {
        String hql = """
            select m from RDChatMessage m
            where m.conversationId = :cid
            order by m.createdAt desc
        """;

        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDChatMessage.class)
                .setParameter("cid", conversationId)
                .setMaxResults(limit)
                .getResultList();
    }

    @Override
    public List<RDChatMessage> getMessagesAfter(Long conversationId, Long lastMessageId) {
        String hql = """
            select m from RDChatMessage m
            where m.conversationId = :cid
              and m.messageId > :mid
            order by m.messageId asc
        """;

        return sessionFactory.getCurrentSession()
                .createQuery(hql, RDChatMessage.class)
                .setParameter("cid", conversationId)
                .setParameter("mid", lastMessageId)
                .getResultList();
    }
    
    @Override
    public List<RDChatMessageDTO> findConversationMessages(Integer conversationId) {

        Session session = sessionFactory.getCurrentSession();

        String hql = """
            select m, u
            from RDChatMessage m
            join RDUser u on u.userID = m.senderUserId
            where m.conversation.conversationId = :conversationId
            order by m.messageId asc
        """;

        Query<Object[]> query = session.createQuery(hql, Object[].class);
        query.setParameter("conversationId", conversationId);

        List<Object[]> rows = query.getResultList();
        List<RDChatMessageDTO> result = new ArrayList<>();

        for (Object[] row : rows) {
            RDChatMessage m = (RDChatMessage) row[0];
            RDUser u = (RDUser) row[1];

            RDChatMessageDTO dto = new RDChatMessageDTO();
            dto.setMessageId(m.getMessageId());
            dto.setSenderUserId(u.getUserID());
            dto.setSenderName(u.getDisplayName()); // 🔥 IMPORTANT LINE
            dto.setMessageText(m.getMessageText());
            dto.setCreatedAt(m.getCreatedAt().toString());

            result.add(dto);
        }

        return result;
    }

    @Override
    public List<RDChatMessageDTO> findNewMessages(
            Integer conversationId,
            Integer lastMessageId
    ) {

        Session session = sessionFactory.getCurrentSession();

        String hql = """
            select m, u
            from RDChatMessage m
            join RDUser u on u.userID = m.senderUserId
            where m.conversation.conversationId = :conversationId
              and m.messageId > :lastMessageId
            order by m.messageId asc
        """;

        Query<Object[]> query = session.createQuery(hql, Object[].class);
        query.setParameter("conversationId", conversationId);
        query.setParameter("lastMessageId", lastMessageId);

        List<Object[]> rows = query.getResultList();
        List<RDChatMessageDTO> result = new ArrayList<>();

        for (Object[] row : rows) {
            RDChatMessage m = (RDChatMessage) row[0];
            RDUser u = (RDUser) row[1];

            RDChatMessageDTO dto = new RDChatMessageDTO();
            dto.setMessageId(m.getMessageId());
            dto.setSenderUserId(u.getUserID());
            dto.setSenderName(u.getDisplayName()); // 🔥 KEY POINT
            dto.setMessageText(m.getMessageText());
            dto.setCreatedAt(m.getCreatedAt().toString());

            result.add(dto);
        }

        return result;
    }


    @Override
    public void saveMessage(
            Long conversationId,
            Integer senderUserId,
            String messageText
    ) {

        RDChatMessage msg = new RDChatMessage();

        msg.setConversationId(conversationId);
        msg.setSenderUserId(senderUserId);
        msg.setMessageType("TEXT");              // default message type
        msg.setMessageText(messageText);
        msg.setCreatedAt(new Date());             // java.util.Date as per entity

        sessionFactory
                .getCurrentSession()
                .save(msg);
    }



}
