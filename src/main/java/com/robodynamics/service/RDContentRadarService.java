package com.robodynamics.service;

import java.time.LocalDate;
import java.util.List;

import com.robodynamics.model.RDContentRadarItem;
import com.robodynamics.model.RDContentRadarSource;
import com.robodynamics.model.RDNewsletterIssue;

public interface RDContentRadarService {

    List<RDContentRadarSource> getAllSources();

    void saveSource(RDContentRadarSource source);

    void deleteSource(Long sourceId);

    int refreshFromActiveSources();

    List<RDContentRadarItem> getLatestItems(String status, int limit);

    RDContentRadarItem getItemById(Long itemId);

    void updateItemStatus(Long itemId, String status, String editorNotes);

    void buildDraftFromItem(Long itemId);

    Integer publishItemToAwareness(Long itemId, boolean publishNow);

    RDNewsletterIssue generateWeeklyNewsletterDraft(LocalDate weekStart);

    List<RDNewsletterIssue> getLatestNewsletterIssues(int limit);

    RDNewsletterIssue getNewsletterIssue(Long issueId);

    void saveNewsletterIssue(RDNewsletterIssue issue);

    Integer publishNewsletterToAwareness(Long issueId);

    void scheduledRefresh();
}
