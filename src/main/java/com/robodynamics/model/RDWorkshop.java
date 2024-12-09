package com.robodynamics.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_workshops")
public class RDWorkshop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workshop_id")
    private int workshopId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "date")
    private Date date;

    @Column(name = "location")
    private String location;

    @Column(name = "flyer_image")
    private String flyerImage;

    @Column(name = "course_contents_pdf")
    private String courseContentsPdf;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "max_participants")
    private Integer maxParticipants;

    @Column(name = "registration_fee")
    private Double registrationFee;

    @Column(name = "created_at", updatable = false)
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    // Default Constructor
    public RDWorkshop() {}

    // Getters and Setters
    public int getWorkshopId() {
        return workshopId;
    }

    public void setWorkshopId(int workshopId) {
        this.workshopId = workshopId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getFlyerImage() {
        return flyerImage;
    }

    public void setFlyerImage(String flyerImage) {
        this.flyerImage = flyerImage;
    }

    public String getCourseContentsPdf() {
        return courseContentsPdf;
    }

    public void setCourseContentsPdf(String courseContentsPdf) {
        this.courseContentsPdf = courseContentsPdf;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Integer getMaxParticipants() {
        return maxParticipants;
    }

    public void setMaxParticipants(Integer maxParticipants) {
        this.maxParticipants = maxParticipants;
    }

    public Double getRegistrationFee() {
        return registrationFee;
    }

    public void setRegistrationFee(Double registrationFee) {
        this.registrationFee = registrationFee;
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

    @Override
    public String toString() {
        return "RDWorkshop [workshopId=" + workshopId + ", name=" + name + ", description=" + description + ", date="
                + date + ", location=" + location + ", flyerImage=" + flyerImage + ", courseContentsPdf="
                + courseContentsPdf + ", duration=" + duration + ", maxParticipants=" + maxParticipants
                + ", registrationFee=" + registrationFee + ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
                + "]";
    }
}
