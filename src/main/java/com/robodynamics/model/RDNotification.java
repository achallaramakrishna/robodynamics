// src/main/java/com/robodynamics/model/Notification.java
package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_notifications")
public class RDNotification {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name="notification_id")
  private Integer id;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(
      name = "user_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_rd_notifications_user")
  )
  private RDUser user; 
  
  
  @Column(nullable=false, length=160)
  private String title;

  @Lob @Column(nullable=false)
  private String body;

  @Column(name="link_url", length=255)
  private String linkUrl;

  @Column(name="read_at")
  private java.sql.Timestamp readAt;

  @Column(name="created_at", insertable=false, updatable=false)
  private java.sql.Timestamp createdAt;

public Integer getId() {
	return id;
}

public void setId(Integer id) {
	this.id = id;
}

public RDUser getUser() {
	return user;
}

public void setUser(RDUser user) {
	this.user = user;
}

public String getTitle() {
	return title;
}

public void setTitle(String title) {
	this.title = title;
}

public String getBody() {
	return body;
}

public void setBody(String body) {
	this.body = body;
}

public String getLinkUrl() {
	return linkUrl;
}

public void setLinkUrl(String linkUrl) {
	this.linkUrl = linkUrl;
}

public java.sql.Timestamp getReadAt() {
	return readAt;
}

public void setReadAt(java.sql.Timestamp readAt) {
	this.readAt = readAt;
}

public java.sql.Timestamp getCreatedAt() {
	return createdAt;
}

public void setCreatedAt(java.sql.Timestamp createdAt) {
	this.createdAt = createdAt;
}

  
}
