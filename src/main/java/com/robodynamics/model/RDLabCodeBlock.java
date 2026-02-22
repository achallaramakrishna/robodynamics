package com.robodynamics.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rd_lab_code_block")
public class RDLabCodeBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_block_id")
    private Integer codeBlockId;

    private String language;

    @Column(name = "code_content", columnDefinition = "LONGTEXT")
    private String codeContent;

    @Column(name = "show_toggle")
    private Boolean showToggle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_step_id", nullable = false)
    private RDLabStep labStep;

	public Integer getCodeBlockId() {
		return codeBlockId;
	}

	public void setCodeBlockId(Integer codeBlockId) {
		this.codeBlockId = codeBlockId;
	}

	public String getLanguage() {
		return language;
	}

	public void setLanguage(String language) {
		this.language = language;
	}

	public String getCodeContent() {
		return codeContent;
	}

	public void setCodeContent(String codeContent) {
		this.codeContent = codeContent;
	}

	public Boolean getShowToggle() {
		return showToggle;
	}

	public void setShowToggle(Boolean showToggle) {
		this.showToggle = showToggle;
	}

	public RDLabStep getLabStep() {
		return labStep;
	}

	public void setLabStep(RDLabStep labStep) {
		this.labStep = labStep;
	}

    
}
