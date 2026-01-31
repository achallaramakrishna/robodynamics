package com.robodynamics.service;

import com.robodynamics.dto.RDChatInboxDTO;
import com.robodynamics.model.RDChatConversation;
import com.robodynamics.model.RDChatMessage;
import com.robodynamics.model.RDUser;

import java.util.List;

public interface RDChatService {

    Long startDirectChat(Integer fromUserId, Integer toUserId);

    Long createGroupChat(Integer creatorUserId, String title, List<Integer> memberUserIds);

    void sendMessage(Long conversationId, Integer senderUserId, String messageText);

    List<RDChatMessage> getMessages(Long conversationId, Integer userId);

    List<RDChatMessage> pollMessages(Long conversationId, Long lastMessageId, Integer userId);

    List<RDChatConversation> getUserConversations(Integer userId);

    List<RDUser> getChatEligibleUsers(Integer userId);
    
    List<RDChatInboxDTO> getInbox(Integer userId);

	RDChatConversation getConversationById(Long id);

	RDChatConversation getConversation(Long conversationId, Integer userId);

	String getOtherUserName(Long conversationId, Integer currentUserId);


}
