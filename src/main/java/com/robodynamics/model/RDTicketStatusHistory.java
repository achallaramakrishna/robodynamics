package com.robodynamics.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.*;


@Entity @Table(name="rd_ticket_status_history")
public class RDTicketStatusHistory {
  @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="ticket_id", nullable=false)
  private RDTicket ticket;

  @Enumerated(EnumType.STRING) private RDTicket.Status oldStatus;
  @Enumerated(EnumType.STRING) private RDTicket.Status newStatus;

  @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="changed_by", nullable=false)
  private RDUser changedBy;

  private LocalDateTime changedAt;

  @PrePersist void pre(){ changedAt=LocalDateTime.now(); }

public Long getId() {
	return id;
}

public void setId(Long id) {
	this.id = id;
}

public RDTicket getTicket() {
	return ticket;
}

public void setTicket(RDTicket ticket) {
	this.ticket = ticket;
}

public RDTicket.Status getOldStatus() {
	return oldStatus;
}

public void setOldStatus(RDTicket.Status oldStatus) {
	this.oldStatus = oldStatus;
}

public RDTicket.Status getNewStatus() {
	return newStatus;
}

public void setNewStatus(RDTicket.Status newStatus) {
	this.newStatus = newStatus;
}

public RDUser getChangedBy() {
	return changedBy;
}

public void setChangedBy(RDUser changedBy) {
	this.changedBy = changedBy;
}

public LocalDateTime getChangedAt() {
	return changedAt;
}

public void setChangedAt(LocalDateTime changedAt) {
	this.changedAt = changedAt;
}

  
}
