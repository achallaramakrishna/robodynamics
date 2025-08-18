package com.robodynamics.dto;

public class RDSessionItem {
	private Integer sessionId;
	private String sessionTitle;
	private Integer tierOrder;
	private String sessionType;

	// REQUIRED: public constructor matching the HQL argument order/types
	public RDSessionItem(Integer sessionId, String sessionTitle, Integer tierOrder, String sessionType) {
		this.sessionId = sessionId;
		this.sessionTitle = sessionTitle;
		this.tierOrder = tierOrder;
		this.sessionType = sessionType;
	}

	public RDSessionItem() {
	} // optional

	public Integer getSessionId() {
		return sessionId;
	}

	public void setSessionId(Integer sessionId) {
		this.sessionId = sessionId;
	}

	public String getSessionTitle() {
		return sessionTitle;
	}

	public void setSessionTitle(String sessionTitle) {
		this.sessionTitle = sessionTitle;
	}

	public Integer getTierOrder() {
		return tierOrder;
	}

	public void setTierOrder(Integer tierOrder) {
		this.tierOrder = tierOrder;
	}

	public String getSessionType() {
		return sessionType;
	}

	public void setSessionType(String sessionType) {
		this.sessionType = sessionType;
	}
}
