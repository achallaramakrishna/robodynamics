package com.robodynamics.model;

import javax.persistence.*;

import com.robodynamics.util.AudienceConverter;
import com.robodynamics.util.StatusConverter;

import java.time.LocalDateTime;

@Entity
@Table(name = "rd_leads", uniqueConstraints = { @UniqueConstraint(name = "uq_rd_leads_phone", columnNames = { "phone" })
// or: @UniqueConstraint(name="uq_rd_leads_phone_audience",
// columnNames={"phone","audience"})
})
public class RDLead {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "lead_id")
	private Long id;

	@Column(nullable = false, length = 120)
	private String name;

	@Column(nullable = false, length = 32)
	private String phone;

	@Column(length = 160)
	private String email;
	

	@Column(length = 160)
	private String grade;
	
	@Column(length = 160)
	private String board;
	
	
	@Column(nullable = false, length = 10)
	private String audience; // parent|mentor

	@Column(length = 120)
	private String source;
	@Column(name = "utm_source", length = 64)
	private String utmSource;
	@Column(name = "utm_medium", length = 64)
	private String utmMedium;
	@Column(name = "utm_campaign", length = 64)
	private String utmCampaign;

	@Column(columnDefinition = "text")	
	private String message;

	@Column(nullable = false, length = 12)
	private String status = "new";

	@Column(name = "created_at", insertable = false, updatable = false)
	private java.sql.Timestamp createdAt;

	@Column(name = "updated_at", insertable = false, updatable = false)
	private java.sql.Timestamp updatedAt;
	
	

	public String getBoard() {
		return board;
	}

	public void setBoard(String board) {
		this.board = board;
	}

	public enum Audience {
	    PARENT("parent"),
	    MENTOR("mentor");

	    private final String db;

	    Audience(String db) {
	        this.db = db;
	    }

	    public String db() {
	        return db;
	    }

	    // This method converts the string value from the database to the corresponding enum value.
	    public static Audience fromDb(String s) {
	        if (s == null) return null;
	        System.out.println("Converting DB value to enum: " + s);  // Debug log
	        switch (s.toLowerCase()) {
	            case "parent":
	                return PARENT;
	            case "mentor":
	                return MENTOR;
	            default:
	                throw new IllegalArgumentException("Unknown audience: " + s);  // Debugging line for unknown values
	        }
	    }

	}



	public enum Status {
	    NEW("new"),
	    CONTACTED("contacted"),
	    QUALIFIED("qualified"),
	    WON("won"),
	    LOST("lost");

	    private final String db;
	    Status(String db) { this.db = db; }
	    public String db() { return db; }
	    public static Status fromDb(String s) {
	        if (s == null) return null;
	        switch (s.toLowerCase()) {
	            case "new": return NEW;
	            case "contacted": return CONTACTED;
	            case "qualified": return QUALIFIED;
	            case "won": return WON;
	            case "lost": return LOST;
	            default: throw new IllegalArgumentException("Unknown status: " + s);
	        }
	    }
	}




	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getAudience() {
		return audience;
	}

	public void setAudience(String audience) {
		this.audience = audience;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getUtmSource() {
		return utmSource;
	}

	public void setUtmSource(String utmSource) {
		this.utmSource = utmSource;
	}

	public String getUtmMedium() {
		return utmMedium;
	}

	public void setUtmMedium(String utmMedium) {
		this.utmMedium = utmMedium;
	}

	public String getUtmCampaign() {
		return utmCampaign;
	}

	public void setUtmCampaign(String utmCampaign) {
		this.utmCampaign = utmCampaign;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public java.sql.Timestamp getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(java.sql.Timestamp createdAt) {
		this.createdAt = createdAt;
	}

	public java.sql.Timestamp getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(java.sql.Timestamp updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	
	
}
