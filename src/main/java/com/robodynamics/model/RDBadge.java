package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_badges")
public class RDBadge {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "badge_id")
	private int id;

	@Column(name = "badge_name", nullable = false)
	private String name;

	@Column(name = "badge_description")
	private String description;

	@Column(name = "badge_image_url")
	private String imageUrl; // Optional image URL for badge representation

	// Getters and Setters
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
}
