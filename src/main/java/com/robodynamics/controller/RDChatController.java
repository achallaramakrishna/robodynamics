package com.robodynamics.controller;

import com.robodynamics.model.RDChatConversation;
import com.robodynamics.model.RDChatMessage;
import com.robodynamics.model.RDChatParticipant;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.*;

@Controller
@RequestMapping("/chat")
public class RDChatController {

    @Autowired
    private RDChatService chatService;

    /* =========================
       Utility
     ========================= */

    private Integer getCurrentUserId(HttpSession session) {
    	Object o = session.getAttribute("rdUser");
        if (!(o instanceof RDUser)) {
            throw new IllegalStateException("User not in session");
        }
        return ((RDUser) o).getUserID();
    }


    /* =========================
       Inbox / Conversation List
     ========================= */

    @GetMapping
    public String inbox(Model model, HttpSession session) {

    	 RDUser currentUser = (RDUser) session.getAttribute("rdUser");
    	    if (currentUser == null) {
    	        return "redirect:/login";
    	    }

    	    model.addAttribute(
    	        "chatUsers",
    	        chatService.getChatEligibleUsers(currentUser.getUserID())
    	    );

    	    model.addAttribute(
    	        "conversations",
    	        chatService.getInbox(currentUser.getUserID())
    	    );

    	    return "chat/inbox";    }

    /* =========================
       Start Direct Chat
     ========================= */

    @PostMapping("/chat/start-direct")
    public String startDirectChat(
            @RequestParam Long toUserId,
            HttpSession session,
            Model model) {

        RDUser me = (RDUser) session.getAttribute("rdUser");

        RDChatConversation convo =
            chatService.getOrCreateDirectConversation(me.getUserId(), toUserId);

        model.addAttribute("conversationId", convo.getConversationId());
        model.addAttribute("messages",
            chatService.getMessages(convo.getConversationId()));
        model.addAttribute("currentUserId", me.getUserId());
        model.addAttribute("lastMessageId", 0L);

        return "chat/conversation :: body"; // IMPORTANT (fragment)
    }



    /* =========================
       Create Group Chat
     ========================= */

    @PostMapping("/create-group")
    public String createGroupChat(@RequestParam("title") String title,
                                  @RequestParam("memberUserIds") List<Integer> memberUserIds,
                                  HttpSession session) {

        Integer creatorUserId = getCurrentUserId(session);

        Long conversationId =
                chatService.createGroupChat(creatorUserId, title, memberUserIds);

        return "redirect:/chat/conversation/" + conversationId;
    }

    /* =========================
       Open Conversation
     ========================= */

    @GetMapping("/conversation/{conversationId}")
    public String openConversation(@PathVariable Long conversationId,
                                   Model model,
                                   HttpSession session) {

        Integer userId = getCurrentUserId(session);
        if (userId == null) {
            return "redirect:/login";
        }

        List<RDChatMessage> messages =
                chatService.getMessages(conversationId, userId);

        Collections.reverse(messages);

        model.addAttribute("conversationId", conversationId);
        model.addAttribute("messages", messages);
        model.addAttribute("currentUserId", userId);

        Long lastMessageId =
                messages.isEmpty() ? 0L
                        : messages.get(messages.size() - 1).getMessageId();

        model.addAttribute("lastMessageId", lastMessageId);

        return "chat/conversation";
    }
    

    /* =========================
       Send Message (AJAX)
     ========================= */

    @PostMapping("/conversation/{conversationId}/send")
    @ResponseBody
    public Map<String, Object> sendMessage(@PathVariable("conversationId") Long conversationId,
                                           @RequestParam("messageText") String messageText,
                                           HttpSession session) {

        Integer userId = getCurrentUserId(session);

        chatService.sendMessage(conversationId, userId, messageText);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return response;
    }

    /* =========================
       Poll Messages (AJAX)
     ========================= */

    @GetMapping("/conversation/{conversationId}/poll")
    @ResponseBody
    public Map<String, Object> pollMessages(@PathVariable("conversationId") Long conversationId,
                                            @RequestParam("lastMessageId") Long lastMessageId,
                                            HttpSession session) {

        Integer userId = getCurrentUserId(session);

        List<RDChatMessage> newMessages =
                chatService.pollMessages(conversationId, lastMessageId, userId);

        List<Map<String, Object>> payload = new ArrayList<>();

        for (RDChatMessage m : newMessages) {
            Map<String, Object> msg = new HashMap<>();
            msg.put("messageId", m.getMessageId());
            msg.put("senderUserId", m.getSenderUserId());
            msg.put("messageText", m.getMessageText());
            msg.put("createdAt", m.getCreatedAt().toString());
            payload.add(msg);
        }

        Long newLastId =
                newMessages.isEmpty() ? lastMessageId
                        : newMessages.get(newMessages.size() - 1).getMessageId();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("messages", payload);
        response.put("lastMessageId", newLastId);

        return response;
    }
}
