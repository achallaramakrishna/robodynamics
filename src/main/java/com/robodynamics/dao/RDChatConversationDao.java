package com.robodynamics.dao;

import com.robodynamics.dto.RDChatInboxDTO;
import com.robodynamics.model.RDChatConversation;
import java.util.List;

public interface RDChatConversationDao {

    RDChatConversation findById(Long conversationId);

    Long save(RDChatConversation conversation);

    RDChatConversation findDirectConversation(Integer userA, Integer userB);

    List<RDChatConversation> findConversationsForUser(Integer userId);

    void updateLastMessageAt(Long conversationId);

	List<RDChatInboxDTO> findInboxByUser(Integer userId);

}
