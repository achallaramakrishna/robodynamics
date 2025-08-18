// com.robodynamics.model.RDTestSessionId
package com.robodynamics.model;

import java.io.Serializable;
import javax.persistence.*;
import java.util.Objects;

@Embeddable
public class RDTestSessionId implements Serializable {
    @Column(name = "test_id", nullable = false)
    private Integer testId;

    @Column(name = "course_session_id", nullable = false)
    private Integer courseSessionId;

    public RDTestSessionId() {}
    public RDTestSessionId(Integer testId, Integer courseSessionId) {
        this.testId = testId;
        this.courseSessionId = courseSessionId;
    }

    public Integer getTestId() { return testId; }
    public void setTestId(Integer testId) { this.testId = testId; }

    public Integer getCourseSessionId() { return courseSessionId; }
    public void setCourseSessionId(Integer courseSessionId) { this.courseSessionId = courseSessionId; }

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RDTestSessionId)) return false;
        RDTestSessionId that = (RDTestSessionId) o;
        return Objects.equals(testId, that.testId) &&
               Objects.equals(courseSessionId, that.courseSessionId);
    }
    @Override public int hashCode() { return Objects.hash(testId, courseSessionId); }
}
