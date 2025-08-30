package com.robodynamics.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.*;

@Entity @Table(name="rd_ticket_attachment")
public class RDTicketAttachment {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long attachmentId;

  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="ticket_id", nullable=false)
  private RDTicket ticket;

  private String fileName;
  private String filePath;

  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="uploaded_by", nullable=false)
  private RDUser uploadedBy;

  private LocalDateTime uploadedAt;

  @PrePersist void pre(){ uploadedAt=LocalDateTime.now(); }

public Long getAttachmentId() {
	return attachmentId;
}

public void setAttachmentId(Long attachmentId) {
	this.attachmentId = attachmentId;
}

public RDTicket getTicket() {
	return ticket;
}

public void setTicket(RDTicket ticket) {
	this.ticket = ticket;
}

public String getFileName() {
	return fileName;
}

public void setFileName(String fileName) {
	this.fileName = fileName;
}

public String getFilePath() {
	return filePath;
}

public void setFilePath(String filePath) {
	this.filePath = filePath;
}

public RDUser getUploadedBy() {
	return uploadedBy;
}

public void setUploadedBy(RDUser uploadedBy) {
	this.uploadedBy = uploadedBy;
}

public LocalDateTime getUploadedAt() {
	return uploadedAt;
}

public void setUploadedAt(LocalDateTime uploadedAt) {
	this.uploadedAt = uploadedAt;
}

  
}