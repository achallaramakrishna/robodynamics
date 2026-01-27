package com.robodynamics.dao;

import com.robodynamics.dto.RDChatMessageDTO;
import com.robodynamics.model.RDChatMessage;
import java.util.List;

public interface RDChatMessageDao {

    Long save(RDChatMessage message);

    List<RDChatMessage> getRecentMessages(Long conversationId, int limit);

    List<RDChatMessage> getMessagesAfter(Long conversationId, Long lastMessageId);
    
    List<RDChatMessageDTO> findConversationMessages(Integer conversationId);

    List<RDChatMessageDTO> findNewMessages(
            Integer conversationId,
            Integer lastMessageId
    );

    void saveMessage(
            Long conversationId,
            Integer senderUserId,
            String messageText
    );

}
