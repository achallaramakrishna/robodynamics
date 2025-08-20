package com.robodynamics.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_demo")
public class RDDemo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "demo_id")
    private int id;

    @Column(name = "title")
    private String title;

    @Column(name = "meta")
    private String meta;

    @Column(name = "is_upcoming")
    private boolean isUpcoming;

    @Column(name = "demo_date")
    private LocalDateTime demoDate;  // Changed to LocalDateTime

    @Column(name = "slug", unique = true)
    private String slug;  // Added slug for URL mapping

    @Column(name = "description")
    private String description;  // Added description for extra info

    // Default constructor
    public RDDemo() {}

    // Constructor with parameters
    public RDDemo(String title, String meta, boolean isUpcoming, LocalDateTime demoDate, String slug, String description) {
        this.title = title;
        this.meta = meta;
        this.isUpcoming = isUpcoming;
        this.demoDate = demoDate;
        this.slug = slug;
        this.description = description;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMeta() {
        return meta;
    }

    public void setMeta(String meta) {
        this.meta = meta;
    }

    public boolean isUpcoming() {
        return isUpcoming;
    }

    public void setUpcoming(boolean isUpcoming) {
        this.isUpcoming = isUpcoming;
    }

    public LocalDateTime getDemoDate() {
        return demoDate;
    }

    public void setDemoDate(LocalDateTime demoDate) {
        this.demoDate = demoDate;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
