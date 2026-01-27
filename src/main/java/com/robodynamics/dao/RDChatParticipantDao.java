package com.robodynamics.dao;

import com.robodynamics.model.RDChatParticipant;
import java.util.List;

public interface RDChatParticipantDao {

    void addParticipant(Long conversationId, Integer userId, boolean isAdmin);

    boolean isParticipant(Long conversationId, Integer userId);

    boolean isAdmin(Long conversationId, Integer userId);

    List<RDChatParticipant> getParticipants(Long conversationId);

    void markRead(Long conversationId, Integer userId);

	void save(RDChatParticipant p1);
}
