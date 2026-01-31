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

    @PostMapping("/start-direct")
    public String startDirectChat(@RequestParam Integer toUserId,
                                  HttpSession session,
                                  Model model) {

        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) return "redirect:/login";

        Long conversationId =
                chatService.startDirectChat(me.getUserID(), toUserId);

        // 🔑 Get conversation + header title
        RDChatConversation conv =
                chatService.getConversation(conversationId, me.getUserID());

        String headerTitle;
        if ("GROUP".equals(conv.getConversationType())) {
            headerTitle = conv.getTitle();
        } else {
            headerTitle = chatService.getOtherUserName(conversationId, me.getUserID());
        }

        model.addAttribute("conversationId", conversationId);
        model.addAttribute("messages",
                chatService.getMessages(conversationId, me.getUserID()));
        model.addAttribute("currentUserId", me.getUserID());
        model.addAttribute("conversationTitle", headerTitle);
        model.addAttribute("conversationType", conv.getConversationType());

        return "chat/conversation";
    }



    @GetMapping("/conversation/{id}")
    public String openConversation(@PathVariable("id") Long id,
                                   HttpSession session,
                                   Model model) {

        RDUser me = (RDUser) session.getAttribute("rdUser");
        if (me == null) return "redirect:/login";

        // Messages
        List<RDChatMessage> messages =
            chatService.getMessages(id, me.getUserID());

        // 🔑 Conversation header info
        RDChatConversation conv = chatService.getConversation(id, me.getUserID());

        String headerTitle;
        if ("GROUP".equals(conv.getConversationType())) {
            headerTitle = conv.getTitle();
        } else {
            // Direct chat → other user's name
            headerTitle = chatService.getOtherUserName(id, me.getUserID());
        }

        model.addAttribute("conversationId", id);
        model.addAttribute("messages", messages);
        model.addAttribute("currentUserId", me.getUserID());
        model.addAttribute("conversationTitle", headerTitle);
        model.addAttribute("conversationType", conv.getConversationType());

        return "chat/conversation";
    }




    /* =========================
       Create Group Chat
     ========================= */

    @PostMapping("/create-group")
    public String createGroupChat(@RequestParam("title") String title,
                                  @RequestParam("memberUserIds") List<Integer> memberUserIds,
                                  HttpSession session, Model model) {

        Integer creatorUserId = getCurrentUserId(session);

        Long conversationId =
                chatService.createGroupChat(creatorUserId, title, memberUserIds);

        model.addAttribute("conversationId", conversationId);
        model.addAttribute("messages",
                chatService.getMessages(conversationId, creatorUserId));
        model.addAttribute("currentUserId", creatorUserId);
        model.addAttribute("lastMessageId", 0L);

        return "chat/conversation";

    }

    /* =========================
       Open Conversation
     ========================= */

    
    

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
