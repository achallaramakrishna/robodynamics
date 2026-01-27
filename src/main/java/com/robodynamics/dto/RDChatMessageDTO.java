package com.robodynamics.dto;

public class RDChatMessageDTO {
	
	private Long messageId;
    private Integer senderUserId;
    private String senderName;
    private String messageText;
    private String createdAt;

    public Long getMessageId() {
		return messageId;
	}
	public void setMessageId(Long messageId) {
		this.messageId = messageId;
	}
	public Integer getSenderUserId() {
		return senderUserId;
	}
	public void setSenderUserId(Integer senderUserId) {
		this.senderUserId = senderUserId;
	}
	public String getSenderName() {
		return senderName;
	}
	public void setSenderName(String senderName) {
		this.senderName = senderName;
	}
	public String getMessageText() {
		return messageText;
	}
	public void setMessageText(String messageText) {
		this.messageText = messageText;
	}
	public String getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}

    
}
