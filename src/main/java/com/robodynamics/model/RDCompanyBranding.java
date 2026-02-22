package com.robodynamics.model;

import java.time.LocalDateTime;

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
@Table(name = "rd_company_branding")
public class RDCompanyBranding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_branding_id")
    private Long companyBrandingId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private RDCompany company;

    @Column(name = "branding_name")
    private String brandingName;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(name = "primary_color")
    private String primaryColor;

    @Column(name = "secondary_color")
    private String secondaryColor;

    @Column(name = "footer_html")
    private String footerHtml;

    @Column(name = "powered_by_label")
    private String poweredByLabel;

    @Column(name = "hide_rd_header", nullable = false)
    private Boolean hideRdHeader;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getCompanyBrandingId() {
        return companyBrandingId;
    }

    public void setCompanyBrandingId(Long companyBrandingId) {
        this.companyBrandingId = companyBrandingId;
    }

    public RDCompany getCompany() {
        return company;
    }

    public void setCompany(RDCompany company) {
        this.company = company;
    }

    public String getBrandingName() {
        return brandingName;
    }

    public void setBrandingName(String brandingName) {
        this.brandingName = brandingName;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getPrimaryColor() {
        return primaryColor;
    }

    public void setPrimaryColor(String primaryColor) {
        this.primaryColor = primaryColor;
    }

    public String getSecondaryColor() {
        return secondaryColor;
    }

    public void setSecondaryColor(String secondaryColor) {
        this.secondaryColor = secondaryColor;
    }

    public String getFooterHtml() {
        return footerHtml;
    }

    public void setFooterHtml(String footerHtml) {
        this.footerHtml = footerHtml;
    }

    public String getPoweredByLabel() {
        return poweredByLabel;
    }

    public void setPoweredByLabel(String poweredByLabel) {
        this.poweredByLabel = poweredByLabel;
    }

    public Boolean getHideRdHeader() {
        return hideRdHeader;
    }

    public void setHideRdHeader(Boolean hideRdHeader) {
        this.hideRdHeader = hideRdHeader;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
