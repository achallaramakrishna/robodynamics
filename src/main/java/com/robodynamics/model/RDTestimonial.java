package com.robodynamics.model;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "rd_testimonials")
public class RDTestimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Either a student or a mentor submits the testimonial
    /** Student (nullable, since mentors can also post testimonials) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", referencedColumnName = "user_id", nullable = true)
    private RDUser student;

    /** Mentor (nullable for student testimonials) */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mentor_id", referencedColumnName = "user_id", nullable = true)
    private RDUser mentor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", referencedColumnName = "course_id", nullable = false)
    private RDCourse course;

    

    public RDCourse getCourse() {
		return course;
	}
	public void setCourse(RDCourse course) {
		this.course = course;
	}
	@Column(name = "course_offering_id")
    private Long courseOfferingId; // Optional: for mentor testimonial

    @Column(name = "testimonial")
    private String testimonial;

    @Column(name = "rating")
    private int rating;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Timestamp createdAt;

    // Transient fields for display
    @Transient
    private String courseName;

    @Transient
    private String studentName;

    @Transient
    private String parentName;

    @Transient
    private String mentorName;

    // --- Getters & Setters ---

    
    
    public Long getId() { return id; }
    public RDUser getStudent() {
		return student;
	}
	public void setStudent(RDUser student) {
		this.student = student;
	}
	public RDUser getMentor() {
		return mentor;
	}
	public void setMentor(RDUser mentor) {
		this.mentor = mentor;
	}
	public void setId(Long id) { this.id = id; }

   
	
    public Long getCourseOfferingId() { return courseOfferingId; }
    public void setCourseOfferingId(Long courseOfferingId) { this.courseOfferingId = courseOfferingId; }

    public String getTestimonial() { return testimonial; }
    public void setTestimonial(String testimonial) { this.testimonial = testimonial; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }

    public String getMentorName() { return mentorName; }
    public void setMentorName(String mentorName) { this.mentorName = mentorName; }
}
