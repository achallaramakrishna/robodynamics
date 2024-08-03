package com.robodynamics.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_visitor_logs")
public class RDVisitorLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int visitor_log_id;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Column(name = "url")
    private String url;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;

	public int getVisitor_log_id() {
		return visitor_log_id;
	}

	public void setVisitor_log_id(int visitor_log_id) {
		this.visitor_log_id = visitor_log_id;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}

    // Getters and Setters
    
    
}
