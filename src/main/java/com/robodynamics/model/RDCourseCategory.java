package com.robodynamics.model;

import java.util.List;
import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_course_categories")
public class RDCourseCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_category_id")
	private int courseCategoryId;

	@Column(name = "parent_course_category_id")
	private int parentCourseCategoryId;

	@Column(name = "course_category_name")
	private String courseCategoryName;

	public int getCourseCategoryId() {
		return courseCategoryId;
	}

	public void setCourseCategoryId(int courseCategoryId) {
		this.courseCategoryId = courseCategoryId;
	}

	public int getParentCourseCategoryId() {
		return parentCourseCategoryId;
	}

	public void setParentCourseCategoryId(int parentCourseCategoryId) {
		this.parentCourseCategoryId = parentCourseCategoryId;
	}

	public String getCourseCategoryName() {
		return courseCategoryName;
	}

	public void setCourseCategoryName(String courseCategoryName) {
		this.courseCategoryName = courseCategoryName;
	}

	@Override
	public int hashCode() {
		return Objects.hash(courseCategoryId, courseCategoryName, parentCourseCategoryId);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		RDCourseCategory other = (RDCourseCategory) obj;
		return courseCategoryId == other.courseCategoryId
				&& Objects.equals(courseCategoryName, other.courseCategoryName)
				&& parentCourseCategoryId == other.parentCourseCategoryId;
	}

	@Override
	public String toString() {
		return "RDCourseCategory [courseCategoryId=" + courseCategoryId + ", parentCourseCategoryId="
				+ parentCourseCategoryId + ", courseCategoryName=" + courseCategoryName + "]";
	}

	public RDCourseCategory(int courseCategoryId, int parentCourseCategoryId, String courseCategoryName) {
		super();
		this.courseCategoryId = courseCategoryId;
		this.parentCourseCategoryId = parentCourseCategoryId;
		this.courseCategoryName = courseCategoryName;
	}

	public RDCourseCategory() {

	}
}
