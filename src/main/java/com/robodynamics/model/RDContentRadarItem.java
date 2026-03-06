package com.robodynamics.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "rd_content_radar_item")
public class RDContentRadarItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @Column(name = "source_id", nullable = false)
    private Long sourceId;

    @Column(name = "source_name", nullable = false)
    private String sourceName;

    @Column(name = "external_guid")
    private String externalGuid;

    @Column(name = "content_type", nullable = false)
    private String contentType;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "canonical_url", nullable = false)
    private String canonicalUrl;

    @Column(name = "summary_text")
    private String summaryText;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "fetched_at", nullable = false)
    private LocalDateTime fetchedAt;

    @Column(name = "keyword_hits", nullable = false)
    private Integer keywordHits;

    @Column(name = "authority_score", nullable = false)
    private Integer authorityScore;

    @Column(name = "freshness_score", nullable = false)
    private Integer freshnessScore;

    @Column(name = "trend_score", nullable = false)
    private Integer trendScore;

    @Column(name = "relevance_score", nullable = false)
    private Integer relevanceScore;

    @Column(name = "total_score", nullable = false)
    private Integer totalScore;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "editor_notes")
    private String editorNotes;

    @Column(name = "draft_title")
    private String draftTitle;

    @Column(name = "draft_excerpt")
    private String draftExcerpt;

    @Column(name = "draft_body", columnDefinition = "TEXT")
    private String draftBody;

    @Column(name = "attribution_required", nullable = false)
    private Boolean attributionRequired;

    @Column(name = "awareness_post_id")
    private Integer awarenessPostId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public Long getSourceId() {
        return sourceId;
    }

    public void setSourceId(Long sourceId) {
        this.sourceId = sourceId;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }

    public String getExternalGuid() {
        return externalGuid;
    }

    public void setExternalGuid(String externalGuid) {
        this.externalGuid = externalGuid;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCanonicalUrl() {
        return canonicalUrl;
    }

    public void setCanonicalUrl(String canonicalUrl) {
        this.canonicalUrl = canonicalUrl;
    }

    public String getSummaryText() {
        return summaryText;
    }

    public void setSummaryText(String summaryText) {
        this.summaryText = summaryText;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public LocalDateTime getFetchedAt() {
        return fetchedAt;
    }

    public void setFetchedAt(LocalDateTime fetchedAt) {
        this.fetchedAt = fetchedAt;
    }

    public Integer getKeywordHits() {
        return keywordHits;
    }

    public void setKeywordHits(Integer keywordHits) {
        this.keywordHits = keywordHits;
    }

    public Integer getAuthorityScore() {
        return authorityScore;
    }

    public void setAuthorityScore(Integer authorityScore) {
        this.authorityScore = authorityScore;
    }

    public Integer getFreshnessScore() {
        return freshnessScore;
    }

    public void setFreshnessScore(Integer freshnessScore) {
        this.freshnessScore = freshnessScore;
    }

    public Integer getTrendScore() {
        return trendScore;
    }

    public void setTrendScore(Integer trendScore) {
        this.trendScore = trendScore;
    }

    public Integer getRelevanceScore() {
        return relevanceScore;
    }

    public void setRelevanceScore(Integer relevanceScore) {
        this.relevanceScore = relevanceScore;
    }

    public Integer getTotalScore() {
        return totalScore;
    }

    public void setTotalScore(Integer totalScore) {
        this.totalScore = totalScore;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getEditorNotes() {
        return editorNotes;
    }

    public void setEditorNotes(String editorNotes) {
        this.editorNotes = editorNotes;
    }

    public String getDraftTitle() {
        return draftTitle;
    }

    public void setDraftTitle(String draftTitle) {
        this.draftTitle = draftTitle;
    }

    public String getDraftExcerpt() {
        return draftExcerpt;
    }

    public void setDraftExcerpt(String draftExcerpt) {
        this.draftExcerpt = draftExcerpt;
    }

    public String getDraftBody() {
        return draftBody;
    }

    public void setDraftBody(String draftBody) {
        this.draftBody = draftBody;
    }

    public Boolean getAttributionRequired() {
        return attributionRequired;
    }

    public void setAttributionRequired(Boolean attributionRequired) {
        this.attributionRequired = attributionRequired;
    }

    public Integer getAwarenessPostId() {
        return awarenessPostId;
    }

    public void setAwarenessPostId(Integer awarenessPostId) {
        this.awarenessPostId = awarenessPostId;
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
