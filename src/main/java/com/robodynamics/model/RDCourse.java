package com.robodynamics.model;

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "rd_courses")
public class RDCourse {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_id")
	private int courseId;
	
	@Column(name = "course_name")
	private String courseName;
	
	@ManyToOne
    @JoinColumn(name = "course_category_id")
    private RDCourseCategory courseCategory;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name="asset_resource_id", nullable = true)
	private Set<RDCourseResource> courseResources = new HashSet<RDCourseResource>();

	public RDCourse() {
		
	}

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

	public RDCourse(int courseId, String courseName, RDCourseCategory courseCategory) {
		super();
		this.courseId = courseId;
		this.courseName = courseName;
		this.courseCategory = courseCategory;
	}

	@Override
	public String toString() {
		return "RDCourse [courseId=" + courseId + ", courseName=" + courseName + ", courseCategory=" + courseCategory
				+ "]";
	}

	@Override
	public int hashCode() {
		return Objects.hash(courseCategory, courseId, courseName);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		RDCourse other = (RDCourse) obj;
		return Objects.equals(courseCategory, other.courseCategory) && courseId == other.courseId
				&& Objects.equals(courseName, other.courseName);
	}

	public Set<RDCourseResource> getCourseResources() {
		return courseResources;
	}

	public void setCourseResources(Set<RDCourseResource> courseResources) {
		this.courseResources = courseResources;
	}

}
