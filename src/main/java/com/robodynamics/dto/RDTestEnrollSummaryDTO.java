package com.robodynamics.dto;

public class RDTestEnrollSummaryDTO {
    private Integer testId;
    private Integer offeringId;
    private String  offeringName;
    private String  gradeLabel;   // keep if you show grades; else ""
    private Integer studentId;
    private String  studentName;
    private Integer parentId;
    private String  parentName;

    public RDTestEnrollSummaryDTO(Integer testId, Integer offeringId, String offeringName,
                                  String gradeLabel, Integer studentId, String studentName,
                                  Integer parentId, String parentName) {
        this.testId = testId;
        this.offeringId = offeringId;
        this.offeringName = offeringName;
        this.gradeLabel = gradeLabel;
        this.studentId = studentId;
        this.studentName = studentName;
        this.parentId = parentId;
        this.parentName = parentName;
    }

    // getters (and setters if you need)
    public Integer getTestId() { return testId; }
    public Integer getOfferingId() { return offeringId; }
    public String getOfferingName() { return offeringName; }
    public String getGradeLabel() { return gradeLabel; }
    public Integer getStudentId() { return studentId; }
    public String getStudentName() { return studentName; }
    public Integer getParentId() { return parentId; }
    public String getParentName() { return parentName; }
}
