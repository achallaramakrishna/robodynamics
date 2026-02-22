package com.robodynamics.model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OrderBy;
import javax.persistence.Table;
import javax.persistence.Column;

import java.util.List;

@Entity
@Table(name = "rd_lab_section")
public class RDLabSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lab_section_id")
    private Integer labSectionId;

    private String title;

    @Column(name = "section_type")
    private String sectionType;

    @Column(name = "display_order")
    private Integer displayOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_manual_id", nullable = false)
    private RDLabManual labManual;

    @OneToMany(mappedBy = "labSection", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("stepNumber ASC")
    private List<RDLabStep> steps;

	public Integer getLabSectionId() {
		return labSectionId;
	}

	public void setLabSectionId(Integer labSectionId) {
		this.labSectionId = labSectionId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getSectionType() {
		return sectionType;
	}

	public void setSectionType(String sectionType) {
		this.sectionType = sectionType;
	}

	public Integer getDisplayOrder() {
		return displayOrder;
	}

	public void setDisplayOrder(Integer displayOrder) {
		this.displayOrder = displayOrder;
	}

	public RDLabManual getLabManual() {
		return labManual;
	}

	public void setLabManual(RDLabManual labManual) {
		this.labManual = labManual;
	}

	public List<RDLabStep> getSteps() {
		return steps;
	}

	public void setSteps(List<RDLabStep> steps) {
		this.steps = steps;
	}

    // getters and setters
}
