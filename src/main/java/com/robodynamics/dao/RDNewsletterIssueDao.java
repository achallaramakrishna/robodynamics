package com.robodynamics.dao;

import java.time.LocalDate;
import java.util.List;

import com.robodynamics.model.RDNewsletterIssue;

public interface RDNewsletterIssueDao {

    void save(RDNewsletterIssue issue);

    RDNewsletterIssue findById(Long issueId);

    RDNewsletterIssue findByWeekStart(LocalDate weekStart);

    List<RDNewsletterIssue> findLatest(int limit);
}
