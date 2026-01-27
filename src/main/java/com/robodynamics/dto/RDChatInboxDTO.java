package com.robodynamics.dto;

import java.util.Date;

public class RDChatInboxDTO {

    private Long conversationId;
    private String conversationType;
    private String title;
    private String displayName;   // 👈 NEW
    private Date lastMessageAt;
    private Date createdAt;

    public RDChatInboxDTO(
            Long conversationId,
            String conversationType,
            String title,
            String displayName,
            Date lastMessageAt,
            Date createdAt
    ) {
        this.conversationId = conversationId;
        this.conversationType = conversationType;
        this.title = title;
        this.displayName = displayName;
        this.lastMessageAt = lastMessageAt;
        this.createdAt = createdAt;
    }

	public Long getConversationId() {
		return conversationId;
	}

	public void setConversationId(Long conversationId) {
		this.conversationId = conversationId;
	}

	public String getConversationType() {
		return conversationType;
	}

	public void setConversationType(String conversationType) {
		this.conversationType = conversationType;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public Date getLastMessageAt() {
		return lastMessageAt;
	}

	public void setLastMessageAt(Date lastMessageAt) {
		this.lastMessageAt = lastMessageAt;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}
}
