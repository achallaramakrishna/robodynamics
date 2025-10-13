package com.robodynamics.model;

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
    private Integer parentCourseCategoryId;

    @Column(name = "course_category_name")
    private String courseCategoryName;

    @Column(name = "image_url")  // New column for image URL
    private String imageUrl;  // Add this field to store the image URL

    // Getters and Setters for all fields
    public int getCourseCategoryId() {
        return courseCategoryId;
    }

    public void setCourseCategoryId(int courseCategoryId) {
        this.courseCategoryId = courseCategoryId;
    }

    public Integer getParentCourseCategoryId() {
        return parentCourseCategoryId;
    }

    public void setParentCourseCategoryId(Integer parentCourseCategoryId) {
        this.parentCourseCategoryId = parentCourseCategoryId;
    }

    public String getCourseCategoryName() {
        return courseCategoryName;
    }

    public void setCourseCategoryName(String courseCategoryName) {
        this.courseCategoryName = courseCategoryName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "RDCourseCategory [courseCategoryId=" + courseCategoryId + ", parentCourseCategoryId="
                + parentCourseCategoryId + ", courseCategoryName=" + courseCategoryName + ", imageUrl=" + imageUrl + "]";
    }

    public RDCourseCategory() {
    }

    public RDCourseCategory(int courseCategoryId, int parentCourseCategoryId, String courseCategoryName, String imageUrl) {
        this.courseCategoryId = courseCategoryId;
        this.parentCourseCategoryId = parentCourseCategoryId;
        this.courseCategoryName = courseCategoryName;
        this.imageUrl = imageUrl;
    }
}
