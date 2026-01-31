package com.robodynamics.controller;

import com.robodynamics.service.RDChatService;
import com.robodynamics.model.RDChatMessage;
import com.robodynamics.model.RDUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
public class RDChatWsController {

    @Autowired private RDChatService chatService;
    @Autowired private SimpMessagingTemplate messagingTemplate;

    /**
     * Client sends to: /app/chat.send
     * We broadcast to:  /topic/conversation.{id}
     */
    @MessageMapping("/chat.send")
    public void send(@Payload ChatSendPayload payload,
                     @Header("simpSessionAttributes") Map<String, Object> sessionAttrs) {

        Object o = sessionAttrs.get("rdUser");
        if (!(o instanceof RDUser)) {
            // ignore / optionally throw
            return;
        }

        RDUser me = (RDUser) o;

        // 1) Persist (re-uses your existing security check: isParticipant)
        chatService.sendMessage(payload.getConversationId(), me.getUserID(), payload.getMessageText());

        // 2) Fetch last message (optional) or just broadcast minimal payload
        // If you have DAO to fetch latest, use it. For now broadcast what client needs:
        Map<String, Object> out = new HashMap<>();
        out.put("conversationId", payload.getConversationId());
        out.put("senderUserId", me.getUserID());
        out.put("messageText", payload.getMessageText());
        out.put("createdAt", String.valueOf(System.currentTimeMillis()));

        messagingTemplate.convertAndSend(
                "/topic/conversation." + payload.getConversationId(),
                out
        );
    }

    public static class ChatSendPayload {
        private Long conversationId;
        private String messageText;

        public Long getConversationId() { return conversationId; }
        public void setConversationId(Long conversationId) { this.conversationId = conversationId; }

        public String getMessageText() { return messageText; }
        public void setMessageText(String messageText) { this.messageText = messageText; }
    }
}
