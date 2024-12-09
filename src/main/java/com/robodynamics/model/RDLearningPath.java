	package com.robodynamics.model;
	
	import javax.persistence.*;
	import java.util.Date;
	import java.util.List;
	
	@Entity
	@Table(name = "rd_exam_prep_learning_paths")
	public class RDLearningPath {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;
	
	    // Foreign key mapping to RDUser
	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id", nullable = false)
	    private RDUser user;
	
	    // Foreign key mapping to RDExam
	    @ManyToOne(fetch = FetchType.EAGER)
	    @JoinColumn(name = "exam_id", nullable = false)
	    private RDExam exam;
	
	    @Column(name = "target_date", nullable = false)
	    @Temporal(TemporalType.DATE)
	    private Date targetDate;
	
	    @Column(name = "status", nullable = false, length = 50)
	    private String status = "Active";
	
	    @Column(name = "created_at", updatable = false)
	    @Temporal(TemporalType.TIMESTAMP)
	    private Date createdAt;
	
	    @Column(name = "updated_at")
	    @Temporal(TemporalType.TIMESTAMP)
	    private Date updatedAt;
	
	    // One-to-Many relationship with RDGoal
	    @OneToMany(mappedBy = "learningPath", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<RDGoal> goals;
	
	    // Getters and Setters
	    public int getId() {
	        return id;
	    }
	
	    public void setId(int id) {
	        this.id = id;
	    }
	
	    public RDUser getUser() {
	        return user;
	    }
	
	    public void setUser(RDUser user) {
	        this.user = user;
	    }
	
	    public RDExam getExam() {
	        return exam;
	    }
	
	    public void setExam(RDExam exam) {
	        this.exam = exam;
	    }
	
	    public Date getTargetDate() {
	        return targetDate;
	    }
	
	    public void setTargetDate(Date targetDate) {
	        this.targetDate = targetDate;
	    }
	
	    public String getStatus() {
	        return status;
	    }
	
	    public void setStatus(String status) {
	        this.status = status;
	    }
	
	    public Date getCreatedAt() {
	        return createdAt;
	    }
	
	    public void setCreatedAt(Date createdAt) {
	        this.createdAt = createdAt;
	    }
	
	    public Date getUpdatedAt() {
	        return updatedAt;
	    }
	
	    public void setUpdatedAt(Date updatedAt) {
	        this.updatedAt = updatedAt;
	    }
	
	    public List<RDGoal> getGoals() {
	        return goals;
	    }
	
	    public void setGoals(List<RDGoal> goals) {
	        this.goals = goals;
	    }
	
	    @Override
	    public String toString() {
	        return "RDLearningPath{" +
	                "id=" + id +
	                ", user=" + (user != null ? user.getUserID() : null) +
	                ", exam=" + (exam != null ? exam.getId() : null) +
	                ", targetDate=" + targetDate +
	                ", status='" + status + '\'' +
	                ", createdAt=" + createdAt +
	                ", updatedAt=" + updatedAt +
	                '}';
	    }
	}
