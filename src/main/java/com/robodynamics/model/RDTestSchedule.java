package com.robodynamics.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rd_test_schedule")
public class RDTestSchedule {

    /** Shared primary key with RDTest */
    @Id
    @Column(name = "test_id")
    private Integer testId;

    /** 1:1 to RDTest via shared PK */
    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "test_id", nullable = false)
    private RDTest test;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(name = "end_at")
    private LocalDateTime endAt;

    @Column(name = "venue", length = 120)
    private String venue;

    @Enumerated(EnumType.STRING)
    @Column(name = "mode", length = 16, nullable = false)
    private RDTestMode mode = RDTestMode.OFFLINE;

    // Optional: uploaded school schedule PDF (relative path)
    @Column(name = "schedule_pdf", length = 255)
    private String schedulePdf;

    /* ---- Validation ---- */
    @PrePersist @PreUpdate
    private void validateTimes() {
        if (endAt != null && endAt.isBefore(startAt)) {
            throw new IllegalArgumentException("endAt must be >= startAt");
        }
    }

    /* ---- Getters/Setters ---- */
    public Integer getTestId() { return testId; }
    public void setTestId(Integer testId) { this.testId = testId; }

    public RDTest getTest() { return test; }
    public void setTest(RDTest test) {
        this.test = test;
        if (test != null) this.testId = test.getTestId();
    }

    public LocalDateTime getStartAt() { return startAt; }
    public void setStartAt(LocalDateTime startAt) { this.startAt = startAt; }

    public LocalDateTime getEndAt() { return endAt; }
    public void setEndAt(LocalDateTime endAt) { this.endAt = endAt; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    public RDTestMode getMode() { return mode; }
    public void setMode(RDTestMode mode) { this.mode = mode; }

    public String getSchedulePdf() { return schedulePdf; }
    public void setSchedulePdf(String schedulePdf) { this.schedulePdf = schedulePdf; }

    /* ---- equals/hashCode on PK ---- */
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RDTestSchedule)) return false;
        RDTestSchedule that = (RDTestSchedule) o;
        return testId != null && testId.equals(that.testId);
    }
    @Override
    public int hashCode() { return testId != null ? testId.hashCode() : 0; }

    @Override
    public String toString() {
        return "RTestSchedule{" +
                "testId=" + testId +
                ", startAt=" + startAt +
                ", endAt=" + endAt +
                ", venue='" + venue + '\'' +
                ", mode=" + mode +
                ", schedulePdf='" + schedulePdf + '\'' +
                '}';
    }
}
