package com.robodynamics.dto;

import java.io.Serializable;

public class RDDataQualityRowDTO implements Serializable {
    private static final long serialVersionUID = 1L;

    private String scopeType;   // "course" | "offering" | "session"
    private Integer scopeId;
    private String scopeLabel;  // e.g., "Offering #20"
    private String scopeName;   // e.g., "Speedy Math With Vedic Tricks"
    private String ruleCode;    // e.g., "O4"
    private String ruleLabel;   // e.g., "Attendance completeness (to date)"
    private Integer expected;
    private Integer found;
    private Integer missing;
    private Double percent;     // 0..100
    private Boolean status;     // true=OK (green), false=Missing (red)
    private String link;        // deeplink to fix page

    public RDDataQualityRowDTO() {}

    // Convenience ctor
    public RDDataQualityRowDTO(String scopeType, Integer scopeId, String scopeLabel, String scopeName,
                               String ruleCode, String ruleLabel,
                               Integer expected, Integer found, Integer missing,
                               Double percent, Boolean status, String link) {
        this.scopeType = scopeType;
        this.scopeId = scopeId;
        this.scopeLabel = scopeLabel;
        this.scopeName = scopeName;
        this.ruleCode = ruleCode;
        this.ruleLabel = ruleLabel;
        this.expected = expected;
        this.found = found;
        this.missing = missing;
        this.percent = percent;
        this.status = status;
        this.link = link;
    }

    // Getters/Setters
    public String getScopeType() { return scopeType; }
    public void setScopeType(String scopeType) { this.scopeType = scopeType; }

    public Integer getScopeId() { return scopeId; }
    public void setScopeId(Integer scopeId) { this.scopeId = scopeId; }

    public String getScopeLabel() { return scopeLabel; }
    public void setScopeLabel(String scopeLabel) { this.scopeLabel = scopeLabel; }

    public String getScopeName() { return scopeName; }
    public void setScopeName(String scopeName) { this.scopeName = scopeName; }

    public String getRuleCode() { return ruleCode; }
    public void setRuleCode(String ruleCode) { this.ruleCode = ruleCode; }

    public String getRuleLabel() { return ruleLabel; }
    public void setRuleLabel(String ruleLabel) { this.ruleLabel = ruleLabel; }

    public Integer getExpected() { return expected; }
    public void setExpected(Integer expected) { this.expected = expected; }

    public Integer getFound() { return found; }
    public void setFound(Integer found) { this.found = found; }

    public Integer getMissing() { return missing; }
    public void setMissing(Integer missing) { this.missing = missing; }

    public Double getPercent() { return percent; }
    public void setPercent(Double percent) { this.percent = percent; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }
}
