package com.robodynamics.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "rd_courses")
public class RDCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private int courseId;

    @Column(name = "course_name", nullable = false)
    private String courseName;
    
    @ManyToOne
    @JoinColumn(name = "course_category_id", nullable = true)
    private RDCourseCategory courseCategory;

    @Column(name = "course_description", columnDefinition = "TEXT")
    private String courseDescription;

    @Column(name = "course_duration", length = 50)
    private String courseDuration;

    @Column(name = "course_level", length = 50)
    private String courseLevel;

    @Column(name = "course_image_url", length = 255)
    private String courseImageUrl;

    @Column(name = "course_price", precision = 10, scale = 2)
    private BigDecimal coursePrice;

    @Column(name = "course_age_group", length = 50)
    private String courseAgeGroup;

    @Column(name = "course_instructor", length = 255)
    private String courseInstructor;

    @Column(name = "course_objectives", columnDefinition = "TEXT")
    private String courseObjectives;

    @Temporal(TemporalType.DATE)
    @Column(name = "course_start_date")
    private Date courseStartDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "course_end_date")
    private Date courseEndDate;

    @Column(name = "course_status", length = 50)
    private String courseStatus;

    @Column(name = "course_registration_url", length = 255)
    private String courseRegistrationUrl;

    @Column(name = "course_overview", columnDefinition = "TEXT")
    private String courseOverview;

    @Column(name = "what_you_will_learn", columnDefinition = "TEXT")
    private String whatYouWillLearn;

    @Column(name = "course_features", columnDefinition = "TEXT")
    private String courseFeatures;

    @Column(name = "detailed_syllabus", columnDefinition = "TEXT")
    private String detailedSyllabus;

    @Column(name = "why_choose_course", columnDefinition = "TEXT")
    private String whyChooseCourse;

    @Column(name = "testimonials", columnDefinition = "TEXT")
    private String testimonials;

    @Column(name = "course_discounts", columnDefinition = "TEXT")
    private String courseDiscounts;

    @Column(name = "registration_link", length = 255)
    private String registrationLink;

   
	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name="course_id", nullable = true)
	@JsonIgnore
	private List<RDCourseSession> courseSessions = new ArrayList<RDCourseSession>();

	
	
    public List<RDCourseSession> getCourseSessions() {
		return courseSessions;
	}

	public void setCourseSessions(List<RDCourseSession> courseSessions) {
		this.courseSessions = courseSessions;
	}

	public RDCourse() {
    }

    public RDCourse(int courseId, String courseName, RDCourseCategory courseCategory) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseCategory = courseCategory;
    }

    // Getters and Setters

    public int getCourseId() {
        return courseId;
    }

    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public RDCourseCategory getCourseCategory() {
        return courseCategory;
    }

    public void setCourseCategory(RDCourseCategory courseCategory) {
        this.courseCategory = courseCategory;
    }

    public String getCourseDescription() {
        return courseDescription;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
    }

    public String getCourseDuration() {
        return courseDuration;
    }

    public void setCourseDuration(String courseDuration) {
        this.courseDuration = courseDuration;
    }

    public String getCourseLevel() {
        return courseLevel;
    }

    public void setCourseLevel(String courseLevel) {
        this.courseLevel = courseLevel;
    }

    public String getCourseImageUrl() {
        return courseImageUrl;
    }

    public void setCourseImageUrl(String courseImageUrl) {
        this.courseImageUrl = courseImageUrl;
    }

    public BigDecimal getCoursePrice() {
        return coursePrice;
    }

    public void setCoursePrice(BigDecimal coursePrice) {
        this.coursePrice = coursePrice;
    }

 

    public String getCourseInstructor() {
        return courseInstructor;
    }

    public void setCourseInstructor(String courseInstructor) {
        this.courseInstructor = courseInstructor;
    }

    public String getCourseObjectives() {
        return courseObjectives;
    }

    public void setCourseObjectives(String courseObjectives) {
        this.courseObjectives = courseObjectives;
    }

    public Date getCourseStartDate() {
        return courseStartDate;
    }

    public void setCourseStartDate(Date courseStartDate) {
        this.courseStartDate = courseStartDate;
    }

    public Date getCourseEndDate() {
        return courseEndDate;
    }

    public void setCourseEndDate(Date courseEndDate) {
        this.courseEndDate = courseEndDate;
    }

    public String getCourseStatus() {
        return courseStatus;
    }

    public void setCourseStatus(String courseStatus) {
        this.courseStatus = courseStatus;
    }

    public String getCourseRegistrationUrl() {
        return courseRegistrationUrl;
    }

    public void setCourseRegistrationUrl(String courseRegistrationUrl) {
        this.courseRegistrationUrl = courseRegistrationUrl;
    }

    public String getCourseOverview() {
        return courseOverview;
    }

    public void setCourseOverview(String courseOverview) {
        this.courseOverview = courseOverview;
    }

    public String getWhatYouWillLearn() {
        return whatYouWillLearn;
    }

    public void setWhatYouWillLearn(String whatYouWillLearn) {
        this.whatYouWillLearn = whatYouWillLearn;
    }

    public String getCourseFeatures() {
        return courseFeatures;
    }

    public void setCourseFeatures(String courseFeatures) {
        this.courseFeatures = courseFeatures;
    }

    public String getDetailedSyllabus() {
        return detailedSyllabus;
    }

    public void setDetailedSyllabus(String detailedSyllabus) {
        this.detailedSyllabus = detailedSyllabus;
    }

    public String getWhyChooseCourse() {
        return whyChooseCourse;
    }

    public void setWhyChooseCourse(String whyChooseCourse) {
        this.whyChooseCourse = whyChooseCourse;
    }

    public String getTestimonials() {
        return testimonials;
    }

    public void setTestimonials(String testimonials) {
        this.testimonials = testimonials;
    }

    public String getCourseDiscounts() {
        return courseDiscounts;
    }

    public void setCourseDiscounts(String courseDiscounts) {
        this.courseDiscounts = courseDiscounts;
    }

    public String getRegistrationLink() {
        return registrationLink;
    }

    public void setRegistrationLink(String registrationLink) {
        this.registrationLink = registrationLink;
    }

   

	public String getCourseAgeGroup() {
		return courseAgeGroup;
	}

	public void setCourseAgeGroup(String courseAgeGroup) {
		this.courseAgeGroup = courseAgeGroup;
	}

	@Override
	public String toString() {
		return "RDCourse [courseId=" + courseId + ", courseName=" + courseName + "]";
	}
    
}
