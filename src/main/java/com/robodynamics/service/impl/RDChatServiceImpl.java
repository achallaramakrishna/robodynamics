package com.robodynamics.service.impl;

import com.robodynamics.dao.RDChatConversationDao;
import com.robodynamics.dao.RDChatMessageDao;
import com.robodynamics.dao.RDChatParticipantDao;
import com.robodynamics.dao.RDChatUserDao;
import com.robodynamics.dto.RDChatInboxDTO;
import com.robodynamics.model.RDChatConversation;
import com.robodynamics.model.RDChatMessage;
import com.robodynamics.model.RDChatParticipant;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

@Service
@Transactional
public class RDChatServiceImpl implements RDChatService {

    @Autowired private RDChatConversationDao conversationDao;
    @Autowired private RDChatParticipantDao participantDao;
    @Autowired private RDChatMessageDao messageDao;
    @Autowired private RDChatUserDao chatUserDao;

    @Override
    @Transactional
    public Long startDirectChat(Integer fromUserId, Integer toUserId) {

        // 1️⃣ Check if conversation already exists (optional but recommended)
        RDChatConversation existingConversation =
                conversationDao.findDirectConversation(fromUserId, toUserId);

        if (existingConversation != null) {
            return existingConversation.getConversationId();
        }

        // 2️⃣ Create conversation
        RDChatConversation conversation = new RDChatConversation();
        conversation.setConversationType("DIRECT");
        conversation.setCreatedBy(fromUserId);              // 🔴 REQUIRED
        conversation.setCreatedAt(new Date());              // 🔴 REQUIRED
        conversation.setStatus("ACTIVE");                   // 🔴 REQUIRED
        conversation.setTitle(null);                        // DIRECT chat → no title

        conversationDao.save(conversation);

        // 3️⃣ Add participants
        RDChatParticipant p1 = new RDChatParticipant();
        p1.setConversation(conversation);
        p1.setUserId(fromUserId);

        RDChatParticipant p2 = new RDChatParticipant();
        p2.setConversation(conversation);
        p2.setUserId(toUserId);

        participantDao.save(p1);
        participantDao.save(p2);

        return conversation.getConversationId();
    }


    @Override
    public Long createGroupChat(Integer creatorUserId, String title, List<Integer> memberUserIds) {

        RDChatConversation conv = new RDChatConversation();
        conv.setConversationType("GROUP");
        conv.setTitle(title);
        conv.setCreatedBy(creatorUserId);
        conv.setCreatedAt(new Date());
        conv.setStatus("ACTIVE");

        Long convId = conversationDao.save(conv);

        participantDao.addParticipant(convId, creatorUserId, true);

        for (Integer uid : memberUserIds) {
            if (!uid.equals(creatorUserId)) {
                participantDao.addParticipant(convId, uid, false);
            }
        }

        return convId;
    }

    @Override
    public void sendMessage(Long conversationId, Integer senderUserId, String messageText) {

        if (!participantDao.isParticipant(conversationId, senderUserId)) {
            throw new SecurityException("User not part of this conversation");
        }

        RDChatMessage msg = new RDChatMessage();
        msg.setConversationId(conversationId);
        msg.setSenderUserId(senderUserId);
        msg.setMessageType("TEXT");
        msg.setMessageText(messageText);

        messageDao.save(msg);
        conversationDao.updateLastMessageAt(conversationId);
    }

    @Override
    public List<RDChatMessage> getMessages(Long conversationId, Integer userId) {

        if (!participantDao.isParticipant(conversationId, userId)) {
            throw new SecurityException("Access denied");
        }

        participantDao.markRead(conversationId, userId);

        return messageDao.getRecentMessages(conversationId, 50);
    }

    @Override
    public List<RDChatMessage> pollMessages(Long conversationId, Long lastMessageId, Integer userId) {

        if (!participantDao.isParticipant(conversationId, userId)) {
            throw new SecurityException("Access denied");
        }

        participantDao.markRead(conversationId, userId);

        return messageDao.getMessagesAfter(conversationId, lastMessageId);
    }

    @Override
    public List<RDChatConversation> getUserConversations(Integer userId) {
        return conversationDao.findConversationsForUser(userId);
    }
    
    @Override
    public List<RDUser> getChatEligibleUsers(Integer currentUserId) {
        return chatUserDao.findChatEligibleUsers(currentUserId);
    }

	@Override
	public List<RDChatInboxDTO> getInbox(Integer userId) {
		return conversationDao.findInboxByUser(userId);
	}
}
