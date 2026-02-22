package com.robodynamics.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import java.util.List;

@Entity
@Table(name = "rd_lab_step")
public class RDLabStep {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lab_step_id")
    private Integer labStepId;

    @Column(name = "step_number")
    private Integer stepNumber;

    private String heading;

    @Column(name = "instruction_html", columnDefinition = "TEXT")
    private String instructionHtml;

    @Column(columnDefinition = "TEXT")
    private String instruction;

    @Column(name = "expected_output_html", columnDefinition = "TEXT")
    private String expectedOutputHtml;

    @Column(columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(name = "is_code")
    private Boolean isCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_section_id", nullable = false)
    private RDLabSection labSection;

    @OneToMany(mappedBy = "labStep", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RDLabCodeBlock> codeBlocks;

    public Integer getLabStepId() { return labStepId; }
    public void setLabStepId(Integer labStepId) { this.labStepId = labStepId; }

    public Integer getStepNumber() { return stepNumber; }
    public void setStepNumber(Integer stepNumber) { this.stepNumber = stepNumber; }

    public String getHeading() { return heading; }
    public void setHeading(String heading) { this.heading = heading; }

    public String getInstructionHtml() { return instructionHtml; }
    public void setInstructionHtml(String instructionHtml) { this.instructionHtml = instructionHtml; }

    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }

    public String getExpectedOutputHtml() { return expectedOutputHtml; }
    public void setExpectedOutputHtml(String expectedOutputHtml) { this.expectedOutputHtml = expectedOutputHtml; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public Boolean getIsCode() { return isCode; }
    public void setIsCode(Boolean isCode) { this.isCode = isCode; }

    public RDLabSection getLabSection() { return labSection; }
    public void setLabSection(RDLabSection labSection) { this.labSection = labSection; }

    public List<RDLabCodeBlock> getCodeBlocks() { return codeBlocks; }
    public void setCodeBlocks(List<RDLabCodeBlock> codeBlocks) { this.codeBlocks = codeBlocks; }
}
