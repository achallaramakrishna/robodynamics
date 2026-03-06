package com.robodynamics.service.impl;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.robodynamics.dao.RDContentRadarItemDao;
import com.robodynamics.dao.RDContentRadarSourceDao;
import com.robodynamics.dao.RDNewsletterIssueDao;
import com.robodynamics.model.RDBlogPost;
import com.robodynamics.model.RDContentRadarItem;
import com.robodynamics.model.RDContentRadarSource;
import com.robodynamics.model.RDNewsletterIssue;
import com.robodynamics.service.RDBlogPostService;
import com.robodynamics.service.RDContentRadarService;

@Service
public class RDContentRadarServiceImpl implements RDContentRadarService {

    private static final Logger log = LoggerFactory.getLogger(RDContentRadarServiceImpl.class);

    private static final String STATUS_DISCOVERED = "DISCOVERED";
    private static final String STATUS_REVIEW = "REVIEW";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";
    private static final String STATUS_DRAFTED = "DRAFTED";
    private static final String STATUS_PUBLISHED = "PUBLISHED";

    private static final Set<String> ALLOWED_ITEM_STATUSES = new HashSet<>(Arrays.asList(
            STATUS_DISCOVERED, STATUS_REVIEW, STATUS_APPROVED, STATUS_REJECTED, STATUS_DRAFTED, STATUS_PUBLISHED
    ));

    private static final Set<String> RELEVANCE_KEYWORDS = new LinkedHashSet<>(Arrays.asList(
            "parent", "parents", "student", "students", "career", "careers",
            "education", "learning", "exam", "board", "cbse", "icse", "grade",
            "school", "college", "future skills", "ai", "assessment", "guidance",
            "roadmap", "stream selection", "mentoring", "newsletter",
            "india", "indian", "ncert", "jee", "neet", "startup", "edtech",
            "artificial intelligence", "machine learning", "stem", "skill development",
            "isro", "ola electric", "deeptech", "spacetech", "agritech", "fintech", "ev"
    ));

    private static final Set<String> TREND_KEYWORDS = new LinkedHashSet<>(Arrays.asList(
            "latest", "new", "report", "policy", "update", "trend", "forecast",
            "top", "ranking", "survey", "admission", "curriculum", "board exam",
            "innovation", "startup", "funding", "launch", "hiring", "internship",
            "mission", "prototype", "breakthrough", "r&d", "pilot"
    ));

    private static final Set<String> BLOCKED_CONTENT_TERMS = new HashSet<>(Arrays.asList(
            "supreme court", "lgbtq", "transgender", "pentagon", "ice detention", "partisan politics",
            "california trans student policy", "religious parents", "gender identity policy"
    ));

    private static final Set<String> INDIA_CONTEXT_KEYWORDS = new HashSet<>(Arrays.asList(
            "india", "indian", "cbse", "icse", "ncert", "jee", "neet", "upsc", "ugc", "aicte",
            "edtech", "startup india", "bengaluru", "bangalore", "hyderabad", "pune", "mumbai",
            "delhi", "chennai", "nasscom", "iit", "iiit", "national education policy",
            "isro", "ola electric", "deeptech", "spacetech", "agritech", "fintech", "electric vehicle", "ev"
    ));

    private static final Set<String> NON_INDIA_POLICY_TERMS = new HashSet<>(Arrays.asList(
            "california", "florida", "texas", "new york", "supreme court", "district court",
            "religious parents", "state legislature", "lgbtq policy", "gender policy"
    ));

    private static final String APTIPATH_CTA_URL = "/registerParentChild?plan=career-basic&redirect=/plans/checkout?plan=career-basic";
    private static final String APTIPATH_CTA_TEXT = "Parent Action: Use AptiPath360 to map your child's top-fit career path before spending on coaching.";

    @Autowired
    private RDContentRadarSourceDao sourceDao;

    @Autowired
    private RDContentRadarItemDao itemDao;

    @Autowired
    private RDNewsletterIssueDao newsletterIssueDao;

    @Autowired
    private RDBlogPostService blogPostService;

    @Value("${rd.content.radar.enabled:true}")
    private boolean radarEnabled;

    @Value("${rd.content.radar.maxItemsPerSource:30}")
    private int maxItemsPerSource;

    @Value("${rd.content.radar.connectTimeoutMs:12000}")
    private int connectTimeoutMs;

    @Value("${rd.content.radar.readTimeoutMs:12000}")
    private int readTimeoutMs;

    @Override
    @Transactional
    public List<RDContentRadarSource> getAllSources() {
        return sourceDao.findAll();
    }

    @Override
    @Transactional
    public void saveSource(RDContentRadarSource source) {
        if (source == null) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        if (source.getSourceId() == null) {
            source.setCreatedAt(now);
            if (source.getActive() == null) {
                source.setActive(Boolean.TRUE);
            }
            if (source.getAuthorityWeight() == null) {
                source.setAuthorityWeight(70);
            }
            if (source.getSourceType() == null || source.getSourceType().trim().isEmpty()) {
                source.setSourceType("RSS");
            }
        }
        source.setAuthorityWeight(clampScore(source.getAuthorityWeight(), 0, 100));
        source.setSourceName(nz(source.getSourceName()).trim());
        source.setSourceType(nz(source.getSourceType()).trim().toUpperCase(Locale.ENGLISH));
        source.setFeedUrl(nz(source.getFeedUrl()).trim());
        source.setBaseUrl(nz(source.getBaseUrl()).trim());
        source.setNotes(nz(source.getNotes()).trim());
        source.setUpdatedAt(now);
        sourceDao.save(source);
    }

    @Override
    @Transactional
    public void deleteSource(Long sourceId) {
        sourceDao.deleteById(sourceId);
    }

    @Override
    @Transactional
    public int refreshFromActiveSources() {
        if (!radarEnabled) {
            return 0;
        }
        List<RDContentRadarSource> activeSources = sourceDao.findActive();
        int total = 0;
        for (RDContentRadarSource source : activeSources) {
            try {
                total += ingestSource(source);
            } catch (Exception ex) {
                log.warn("Content radar source ingest failed: sourceId={}, feedUrl={}",
                        source.getSourceId(), source.getFeedUrl(), ex);
            }
        }
        return total;
    }

    @Override
    @Transactional
    public List<RDContentRadarItem> getLatestItems(String status, int limit) {
        int maxRows = Math.max(1, Math.min(limit, 500));
        if (status == null || status.trim().isEmpty() || "ALL".equalsIgnoreCase(status.trim())) {
            return itemDao.findLatestAll(maxRows);
        }
        return itemDao.findLatest(status.trim().toUpperCase(Locale.ENGLISH), maxRows);
    }

    @Override
    @Transactional
    public RDContentRadarItem getItemById(Long itemId) {
        return itemDao.findById(itemId);
    }

    @Override
    @Transactional
    public void updateItemStatus(Long itemId, String status, String editorNotes) {
        RDContentRadarItem item = itemDao.findById(itemId);
        if (item == null) {
            return;
        }
        String normalized = nz(status).trim().toUpperCase(Locale.ENGLISH);
        if (!ALLOWED_ITEM_STATUSES.contains(normalized)) {
            normalized = STATUS_REVIEW;
        }
        item.setStatus(normalized);
        item.setEditorNotes(nz(editorNotes).trim());
        item.setUpdatedAt(LocalDateTime.now());
        itemDao.save(item);
    }

    @Override
    @Transactional
    public void buildDraftFromItem(Long itemId) {
        RDContentRadarItem item = itemDao.findById(itemId);
        if (item == null) {
            return;
        }
        String cleanSummary = summarize(nz(item.getSummaryText()), 280);
        if (cleanSummary.isEmpty()) {
            cleanSummary = "Relevant update for parents and students from trusted education sources.";
        }
        String sourceLine = "Source: " + nz(item.getSourceName());
        String parentAction = " " + buildParentAction(item);
        item.setDraftTitle(stripParentAlertPrefix(nz(item.getTitle()).trim()));
        item.setDraftExcerpt(cleanSummary + " " + sourceLine + parentAction);
        item.setDraftBody(
                "<p><strong>Why this matters for parents:</strong> " + escapeHtml(cleanSummary) + "</p>"
                        + "<p><strong>Parent Action This Week:</strong> " + escapeHtml(parentAction) + "</p>"
                        + "<p><strong>Original Source:</strong> <a href=\"" + escapeHtml(nz(item.getCanonicalUrl()))
                        + "\" target=\"_blank\" rel=\"noopener\">" + escapeHtml(nz(item.getSourceName())) + "</a></p>"
                        + "<p><strong>AptiPath360:</strong> <a href=\"" + APTIPATH_CTA_URL + "\">Assess your child now</a></p>"
                        + "<p><em>Note: This summary is curated for awareness. Read the original source for complete context.</em></p>"
        );
        item.setStatus(STATUS_DRAFTED);
        item.setUpdatedAt(LocalDateTime.now());
        itemDao.save(item);
    }

    @Override
    @Transactional
    public Integer publishItemToAwareness(Long itemId, boolean publishNow) {
        RDContentRadarItem item = itemDao.findById(itemId);
        if (item == null) {
            return null;
        }
        RDBlogPost post = null;
        if (item.getAwarenessPostId() != null && item.getAwarenessPostId() > 0) {
            post = blogPostService.getBlogPostById(item.getAwarenessPostId());
        }
        if (post == null) {
            post = new RDBlogPost();
        }
        String title = nz(item.getDraftTitle()).trim();
        if (title.isEmpty()) {
            title = nz(item.getTitle()).trim();
        }
        title = stripParentAlertPrefix(title);
        String excerpt = nz(item.getDraftExcerpt()).trim();
        if (excerpt.isEmpty()) {
            excerpt = summarize(nz(item.getSummaryText()), 260)
                    + " Source: " + nz(item.getSourceName());
        }
        excerpt = summarize(excerpt + " " + APTIPATH_CTA_TEXT, 950);
        post.setTitle(title);
        post.setExcerpt(excerpt);
        // Attribution-first: always outbound to original source unless manually changed in awareness admin.
        post.setHref(trimMax(nz(item.getCanonicalUrl()).trim(), 240));
        if (nz(post.getImageUrl()).trim().isEmpty()) {
            post.setImageUrl(resolveAwarenessImage(item));
        }
        post.setPublished(publishNow);
        blogPostService.saveOrUpdateBlogPost(post);

        item.setAwarenessPostId(post.getId());
        item.setStatus(publishNow ? STATUS_PUBLISHED : STATUS_APPROVED);
        item.setUpdatedAt(LocalDateTime.now());
        itemDao.save(item);
        return post.getId();
    }

    @Override
    @Transactional
    public RDNewsletterIssue generateWeeklyNewsletterDraft(LocalDate weekStart) {
        LocalDate ws = weekStart == null ? LocalDate.now().with(DayOfWeek.MONDAY) : weekStart.with(DayOfWeek.MONDAY);
        RDNewsletterIssue existing = newsletterIssueDao.findByWeekStart(ws);
        if (existing != null) {
            return existing;
        }
        LocalDateTime start = ws.atStartOfDay();
        LocalDateTime end = ws.plusDays(7).atStartOfDay();

        List<RDContentRadarItem> items = itemDao.findForWindow(
                start,
                end,
                Arrays.asList(STATUS_APPROVED, STATUS_PUBLISHED, STATUS_DRAFTED, STATUS_DISCOVERED),
                12
        ).stream()
                .sorted(Comparator.comparing(RDContentRadarItem::getTotalScore).reversed())
                .limit(8)
                .collect(Collectors.toList());

        RDNewsletterIssue issue = new RDNewsletterIssue();
        LocalDate today = LocalDate.now();
        issue.setWeekStart(ws);
        issue.setWeekEnd(ws.plusDays(6));
        issue.setTitle("AptiPath360 Weekly Parent Newsletter - " + today);
        issue.setSubjectLine("Top 20 careers in the next 10 years (India) + parent action plan");
        issue.setBodyHtml(buildNewsletterHtml(items, ws, ws.plusDays(6)));
        issue.setSourceItemIds(items.stream()
                .map(i -> String.valueOf(i.getItemId()))
                .collect(Collectors.joining(",")));
        issue.setStatus("DRAFT");
        issue.setAwarenessPostId(null);
        issue.setCreatedAt(LocalDateTime.now());
        issue.setUpdatedAt(LocalDateTime.now());
        newsletterIssueDao.save(issue);
        return issue;
    }

    @Override
    @Transactional
    public List<RDNewsletterIssue> getLatestNewsletterIssues(int limit) {
        return newsletterIssueDao.findLatest(Math.max(1, Math.min(limit, 50)));
    }

    @Override
    @Transactional
    public RDNewsletterIssue getNewsletterIssue(Long issueId) {
        return newsletterIssueDao.findById(issueId);
    }

    @Override
    @Transactional
    public void saveNewsletterIssue(RDNewsletterIssue issue) {
        if (issue == null) {
            return;
        }
        LocalDateTime now = LocalDateTime.now();
        if (issue.getIssueId() == null) {
            issue.setCreatedAt(now);
            if (issue.getStatus() == null || issue.getStatus().trim().isEmpty()) {
                issue.setStatus("DRAFT");
            }
        }
        issue.setUpdatedAt(now);
        issue.setTitle(nz(issue.getTitle()).trim());
        issue.setSubjectLine(nz(issue.getSubjectLine()).trim());
        issue.setBodyHtml(nz(issue.getBodyHtml()));
        issue.setSourceItemIds(nz(issue.getSourceItemIds()).trim());
        issue.setStatus(nz(issue.getStatus()).trim().toUpperCase(Locale.ENGLISH));
        newsletterIssueDao.save(issue);
    }

    @Override
    @Transactional
    public Integer publishNewsletterToAwareness(Long issueId) {
        RDNewsletterIssue issue = newsletterIssueDao.findById(issueId);
        if (issue == null) {
            return null;
        }
        RDBlogPost post = null;
        if (issue.getAwarenessPostId() != null && issue.getAwarenessPostId() > 0) {
            post = blogPostService.getBlogPostById(issue.getAwarenessPostId());
        }
        if (post == null) {
            post = new RDBlogPost();
        }
        post.setTitle(nz(issue.getTitle()).trim());
        post.setExcerpt("Top 20 careers in next 10 years (India) + weekly parent action plan. Click to read full issue.");
        post.setHref("/newsletter/issue/" + issue.getIssueId());
        post.setImageUrl("/resources/images/hero_parents.jpg");
        post.setPublished(true);
        blogPostService.saveOrUpdateBlogPost(post);

        issue.setAwarenessPostId(post.getId());
        issue.setStatus("APPROVED");
        issue.setApprovedAt(LocalDateTime.now());
        issue.setUpdatedAt(LocalDateTime.now());
        newsletterIssueDao.save(issue);
        return post.getId();
    }

    @Scheduled(cron = "${rd.content.radar.cron:0 0 */6 * * *}")
    @Override
    public void scheduledRefresh() {
        if (!radarEnabled) {
            return;
        }
        try {
            int upserts = refreshFromActiveSources();
            log.info("Content radar refresh completed. upserts={}", upserts);
        } catch (Exception ex) {
            log.warn("Content radar scheduled refresh failed", ex);
        }
    }

    private int ingestSource(RDContentRadarSource source) {
        if (source == null || source.getSourceId() == null || !Boolean.TRUE.equals(source.getActive())) {
            return 0;
        }
        List<RssItem> fetchedItems = parseRssItems(source.getFeedUrl(), maxItemsPerSource);
        int upserts = 0;
        for (RssItem rss : fetchedItems) {
            String title = nz(rss.title).trim();
            String canonicalUrl = canonicalizeUrl(rss.link);
            if (title.isEmpty() || canonicalUrl.isEmpty()) {
                continue;
            }
            String searchable = (title + " " + nz(rss.description)).toLowerCase(Locale.ENGLISH);
            if (isBlockedByPolicy(searchable)) {
                continue;
            }
            if (!isIndiaRelevantContext(searchable, nz(source.getSourceName()))) {
                continue;
            }
            RDContentRadarItem item = itemDao.findByCanonicalUrl(canonicalUrl);
            if (item == null && rss.guid != null && !rss.guid.trim().isEmpty()) {
                item = itemDao.findBySourceGuid(source.getSourceId(), rss.guid.trim());
            }
            boolean isNew = false;
            if (item == null) {
                item = new RDContentRadarItem();
                item.setCreatedAt(LocalDateTime.now());
                item.setSourceId(source.getSourceId());
                item.setSourceName(nz(source.getSourceName()).trim());
                isNew = true;
            }

            ScoreCard scoreCard = scoreContent(title, rss.description, source.getAuthorityWeight(), rss.publishedAt);
            item.setExternalGuid(trimMax(nz(rss.guid).trim(), 250));
            item.setContentType(detectContentType(title, rss.description));
            item.setTitle(trimMax(title, 480));
            item.setCanonicalUrl(canonicalUrl);
            item.setSummaryText(summarize(stripHtml(nz(rss.description)), 480));
            item.setPublishedAt(rss.publishedAt);
            item.setFetchedAt(LocalDateTime.now());
            item.setKeywordHits(scoreCard.keywordHits);
            item.setAuthorityScore(scoreCard.authorityScore);
            item.setFreshnessScore(scoreCard.freshnessScore);
            item.setTrendScore(scoreCard.trendScore);
            item.setRelevanceScore(scoreCard.relevanceScore);
            item.setTotalScore(scoreCard.totalScore);
            item.setAttributionRequired(Boolean.TRUE);
            if (isNew || isAutoMutableStatus(item.getStatus())) {
                item.setStatus(STATUS_DISCOVERED);
            }
            item.setUpdatedAt(LocalDateTime.now());
            itemDao.save(item);
            upserts++;
        }
        return upserts;
    }

    private boolean isAutoMutableStatus(String status) {
        String normalized = nz(status).trim().toUpperCase(Locale.ENGLISH);
        return normalized.isEmpty() || STATUS_DISCOVERED.equals(normalized) || STATUS_REVIEW.equals(normalized);
    }

    private ScoreCard scoreContent(String title, String description, Integer authorityWeight, LocalDateTime publishedAt) {
        String searchable = (nz(title) + " " + nz(description)).toLowerCase(Locale.ENGLISH);
        int relevanceHits = 0;
        for (String keyword : RELEVANCE_KEYWORDS) {
            if (searchable.contains(keyword)) {
                relevanceHits++;
            }
        }
        int trendHits = 0;
        for (String keyword : TREND_KEYWORDS) {
            if (searchable.contains(keyword)) {
                trendHits++;
            }
        }
        int relevanceScore = clampScore(20 + (relevanceHits * 8), 0, 100);
        int trendScore = clampScore(15 + (trendHits * 14), 0, 100);
        int authorityScore = clampScore(authorityWeight == null ? 60 : authorityWeight, 0, 100);
        int freshnessScore = calculateFreshness(publishedAt);
        int total = clampScore(
                (int) Math.round((relevanceScore * 0.35) + (freshnessScore * 0.25) + (authorityScore * 0.25) + (trendScore * 0.15)),
                0,
                100
        );
        ScoreCard card = new ScoreCard();
        card.keywordHits = relevanceHits;
        card.authorityScore = authorityScore;
        card.freshnessScore = freshnessScore;
        card.trendScore = trendScore;
        card.relevanceScore = relevanceScore;
        card.totalScore = total;
        return card;
    }

    private int calculateFreshness(LocalDateTime publishedAt) {
        if (publishedAt == null) {
            return 35;
        }
        long hours = Math.abs(Duration.between(publishedAt, LocalDateTime.now()).toHours());
        if (hours <= 24) {
            return 100;
        }
        if (hours <= 48) {
            return 85;
        }
        if (hours <= 96) {
            return 70;
        }
        if (hours <= 168) {
            return 55;
        }
        if (hours <= 336) {
            return 40;
        }
        return 25;
    }

    private List<RssItem> parseRssItems(String feedUrl, int maxItems) {
        if (feedUrl == null || feedUrl.trim().isEmpty()) {
            return Collections.emptyList();
        }
        try {
            HttpURLConnection conn = (HttpURLConnection) new URL(feedUrl.trim()).openConnection();
            conn.setRequestMethod("GET");
            conn.setConnectTimeout(connectTimeoutMs);
            conn.setReadTimeout(readTimeoutMs);
            conn.setRequestProperty("Accept", "application/rss+xml, application/xml, text/xml");
            conn.setRequestProperty("User-Agent", "RobodynamicsContentRadar/1.0");
            try (InputStream is = conn.getInputStream()) {
                byte[] rawBytes = is.readAllBytes();
                if (rawBytes == null || rawBytes.length == 0) {
                    return Collections.emptyList();
                }
                String rawXml = new String(rawBytes, StandardCharsets.UTF_8);
                int firstTag = rawXml.indexOf('<');
                if (firstTag > 0) {
                    rawXml = rawXml.substring(firstTag);
                }
                if (rawXml.trim().isEmpty()) {
                    return Collections.emptyList();
                }
                DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
                secureXmlFactory(dbf);
                DocumentBuilder builder = dbf.newDocumentBuilder();
                Document doc = builder.parse(new ByteArrayInputStream(rawXml.getBytes(StandardCharsets.UTF_8)));
                doc.getDocumentElement().normalize();

                List<RssItem> rows = parseRssNodes(doc.getElementsByTagName("item"), maxItems);
                if (!rows.isEmpty()) {
                    return rows;
                }
                return parseAtomEntries(doc.getElementsByTagName("entry"), maxItems);
            }
        } catch (Exception ex) {
            log.warn("Failed to parse feed: {}", feedUrl, ex);
            return Collections.emptyList();
        }
    }

    private void secureXmlFactory(DocumentBuilderFactory dbf) {
        try {
            dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
            dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
            dbf.setFeature("http://apache.org/xml/features/nonvalidating/load-external-dtd", false);
            dbf.setXIncludeAware(false);
            dbf.setExpandEntityReferences(false);
        } catch (Exception ignored) {
            // Keep parser functional even if a feature is unsupported.
        }
    }

    private List<RssItem> parseRssNodes(NodeList nodeList, int maxItems) {
        List<RssItem> rows = new ArrayList<>();
        for (int i = 0; i < nodeList.getLength() && rows.size() < maxItems; i++) {
            Node node = nodeList.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) {
                continue;
            }
            Element el = (Element) node;
            RssItem item = new RssItem();
            item.title = childText(el, "title");
            item.link = childText(el, "link");
            item.description = childText(el, "description");
            item.guid = childText(el, "guid");
            item.publishedAt = parseFeedDate(childText(el, "pubDate"));
            if (item.title != null && item.link != null) {
                rows.add(item);
            }
        }
        return rows;
    }

    private List<RssItem> parseAtomEntries(NodeList nodeList, int maxItems) {
        List<RssItem> rows = new ArrayList<>();
        for (int i = 0; i < nodeList.getLength() && rows.size() < maxItems; i++) {
            Node node = nodeList.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) {
                continue;
            }
            Element el = (Element) node;
            RssItem item = new RssItem();
            item.title = childText(el, "title");
            item.link = atomLink(el);
            item.description = firstNonBlank(childText(el, "summary"), childText(el, "content"));
            item.guid = childText(el, "id");
            item.publishedAt = parseFeedDate(firstNonBlank(childText(el, "updated"), childText(el, "published")));
            if (item.title != null && item.link != null) {
                rows.add(item);
            }
        }
        return rows;
    }

    private String atomLink(Element entry) {
        NodeList links = entry.getElementsByTagName("link");
        for (int i = 0; i < links.getLength(); i++) {
            Node node = links.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) {
                continue;
            }
            Element linkEl = (Element) node;
            String rel = nz(linkEl.getAttribute("rel")).trim();
            String href = nz(linkEl.getAttribute("href")).trim();
            if (href.isEmpty()) {
                continue;
            }
            if (rel.isEmpty() || "alternate".equalsIgnoreCase(rel)) {
                return href;
            }
        }
        return "";
    }

    private String childText(Element parent, String tagName) {
        NodeList nodes = parent.getElementsByTagName(tagName);
        if (nodes == null || nodes.getLength() == 0) {
            return "";
        }
        Node node = nodes.item(0);
        if (node == null) {
            return "";
        }
        return node.getTextContent() == null ? "" : node.getTextContent();
    }

    private LocalDateTime parseFeedDate(String value) {
        String raw = nz(value).trim();
        if (raw.isEmpty()) {
            return null;
        }
        List<DateTimeFormatter> formatters = Arrays.asList(
                DateTimeFormatter.RFC_1123_DATE_TIME,
                DateTimeFormatter.ISO_OFFSET_DATE_TIME,
                DateTimeFormatter.ISO_ZONED_DATE_TIME
        );
        for (DateTimeFormatter formatter : formatters) {
            try {
                if (formatter == DateTimeFormatter.RFC_1123_DATE_TIME) {
                    ZonedDateTime zdt = ZonedDateTime.parse(raw, formatter);
                    return zdt.toLocalDateTime();
                }
                OffsetDateTime odt = OffsetDateTime.parse(raw, formatter);
                return odt.toLocalDateTime();
            } catch (Exception ignored) {
            }
        }
        try {
            return LocalDateTime.parse(raw);
        } catch (Exception ignored) {
            return null;
        }
    }

    private String detectContentType(String title, String description) {
        String searchable = (nz(title) + " " + nz(description)).toLowerCase(Locale.ENGLISH);
        if (searchable.contains("newsletter")) {
            return "NEWSLETTER";
        }
        if (searchable.contains("blog")) {
            return "BLOG";
        }
        return "ARTICLE";
    }

    private String canonicalizeUrl(String url) {
        String clean = nz(url).trim();
        if (clean.isEmpty()) {
            return "";
        }
        if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
            return clean;
        }
        int q = clean.indexOf('?');
        if (q < 0) {
            return clean;
        }
        String base = clean.substring(0, q);
        String query = clean.substring(q + 1);
        if (query.isEmpty()) {
            return base;
        }
        List<String> keep = Arrays.stream(query.split("&"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .filter(s -> {
                    String lower = s.toLowerCase(Locale.ENGLISH);
                    return !(lower.startsWith("utm_")
                            || lower.startsWith("gclid")
                            || lower.startsWith("fbclid")
                            || lower.startsWith("mc_cid")
                            || lower.startsWith("mc_eid"));
                })
                .collect(Collectors.toList());
        if (keep.isEmpty()) {
            return trimMax(base, 500);
        }
        return trimMax(base + "?" + String.join("&", keep), 500);
    }

    private String buildNewsletterHtml(List<RDContentRadarItem> items, LocalDate weekStart, LocalDate weekEnd) {
        StringBuilder sb = new StringBuilder();
        sb.append("<h2>AptiPath360 Weekly Parent Newsletter</h2>");
        sb.append("<p><strong>Week:</strong> ").append(weekStart).append(" to ").append(weekEnd).append("</p>");
        sb.append(buildTop20CareersBlock());
        sb.append("<p>This digest contains curated updates from reputed sources. Please read originals via source links.</p>");
        sb.append("<p><strong>").append(APTIPATH_CTA_TEXT)
                .append(" <a href=\"").append(APTIPATH_CTA_URL).append("\">Start AptiPath360</a></strong></p>");
        sb.append("<hr/>");
        if (items == null || items.isEmpty()) {
            sb.append("<p>No high-relevance items were found this week.</p>");
            return sb.toString();
        }
        sb.append("<ol>");
        for (RDContentRadarItem item : items) {
            sb.append("<li style=\"margin-bottom:12px;\">")
                    .append("<strong>").append(escapeHtml(nz(item.getTitle()))).append("</strong><br/>")
                    .append(escapeHtml(summarize(nz(item.getSummaryText()), 280))).append("<br/>")
                    .append("<em>Source: ").append(escapeHtml(nz(item.getSourceName()))).append("</em><br/>")
                    .append("<a href=\"").append(escapeHtml(nz(item.getCanonicalUrl())))
                    .append("\" target=\"_blank\" rel=\"noopener\">Read original article</a>")
                    .append("</li>");
        }
        sb.append("</ol>");
        return sb.toString();
    }

    private String stripHtml(String input) {
        return nz(input).replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
    }

    private String summarize(String input, int maxLen) {
        String clean = nz(input).replaceAll("\\s+", " ").trim();
        if (clean.length() <= maxLen) {
            return clean;
        }
        return clean.substring(0, Math.max(0, maxLen - 3)).trim() + "...";
    }

    private int clampScore(Integer value, int min, int max) {
        int v = value == null ? min : value;
        if (v < min) {
            return min;
        }
        if (v > max) {
            return max;
        }
        return v;
    }

    private String escapeHtml(String raw) {
        String s = nz(raw);
        s = s.replace("&", "&amp;");
        s = s.replace("<", "&lt;");
        s = s.replace(">", "&gt;");
        s = s.replace("\"", "&quot;");
        return s;
    }

    private String firstNonBlank(String a, String b) {
        String x = nz(a).trim();
        if (!x.isEmpty()) {
            return x;
        }
        return nz(b).trim();
    }

    private String nz(String value) {
        return value == null ? "" : value;
    }

    private String stripParentAlertPrefix(String title) {
        String clean = nz(title).trim();
        if (clean.toLowerCase(Locale.ENGLISH).startsWith("parent alert:")) {
            return clean.substring("parent alert:".length()).trim();
        }
        if (clean.toLowerCase(Locale.ENGLISH).startsWith("parent alert -")) {
            return clean.substring("parent alert -".length()).trim();
        }
        return clean;
    }

    private boolean isBlockedByPolicy(String searchable) {
        String text = nz(searchable).toLowerCase(Locale.ENGLISH);
        for (String term : BLOCKED_CONTENT_TERMS) {
            if (text.contains(term)) {
                return true;
            }
        }
        return false;
    }

    private boolean isIndiaRelevantContext(String searchable, String sourceName) {
        String text = (nz(searchable) + " " + nz(sourceName)).toLowerCase(Locale.ENGLISH);
        boolean hasIndiaSignal = containsAny(text, INDIA_CONTEXT_KEYWORDS.toArray(new String[0]));
        if (hasIndiaSignal) {
            return true;
        }

        if (containsAny(text, "ai", "artificial intelligence", "machine learning", "career", "skills",
                "education", "student", "startup")) {
            for (String term : NON_INDIA_POLICY_TERMS) {
                if (text.contains(term)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    private String buildParentAction(RDContentRadarItem item) {
        String text = (nz(item.getTitle()) + " " + nz(item.getSummaryText())).toLowerCase(Locale.ENGLISH);
        if (containsAny(text, "isro", "space", "satellite", "rocket", "ola", "electric vehicle", "ev")) {
            return "Pick one India innovation story this week and map student skills needed (math, science, coding, design) in AptiPath360.";
        }
        if (text.contains("startup") || text.contains("funding") || text.contains("innovation")) {
            return "Discuss one India startup story with your child this week and map required skills in AptiPath360.";
        }
        if (text.contains("ai")) {
            return "Ask your child to complete one AI or coding mini-project this month and benchmark interest in AptiPath360.";
        }
        if (text.contains("admission") || text.contains("college") || text.contains("exam")) {
            return "Use AptiPath360 report to align stream, exam plan, and monthly study priorities.";
        }
        return "Review your child's strengths this week and map next-step skills with AptiPath360.";
    }

    private String resolveAwarenessImage(RDContentRadarItem item) {
        String searchable = (nz(item.getTitle()) + " " + nz(item.getSummaryText()) + " " + nz(item.getSourceName()))
                .toLowerCase(Locale.ENGLISH);
        if (containsAny(searchable, "neet", "jee", "exam", "board", "admission", "cbse", "icse", "ncert")) {
            return "/resources/images/mega-olympiad.png";
        }
        if (containsAny(searchable, "startup", "innovation", "founder", "funding", "unicorn", "venture")) {
            return "/resources/images/Ai3.jpg";
        }
        if (containsAny(searchable, "ai", "machine learning", "data", "digital", "technology", "robot", "future skill", "genai")) {
            return "/resources/images/Ai.jpg";
        }
        if (containsAny(searchable, "coding", "computer", "stem", "programming", "hackathon", "project")) {
            return "/resources/images/coding2.jpg";
        }
        if (containsAny(searchable, "career", "student", "school", "college", "learning", "education", "internship", "job")) {
            return "/resources/images/Ai1.jpg";
        }
        if (containsAny(searchable, "tuition", "mentor", "support")) {
            return "/resources/images/mega-tuition.jpg";
        }
        return "/resources/images/hero_parents.jpg";
    }

    private boolean containsAny(String text, String... keywords) {
        String hay = nz(text).toLowerCase(Locale.ENGLISH);
        for (String keyword : keywords) {
            if (hay.contains(nz(keyword).toLowerCase(Locale.ENGLISH))) {
                return true;
            }
        }
        return false;
    }

    private String buildTop20CareersBlock() {
        List<String> careers = Arrays.asList(
                "AI Engineer", "Data Scientist", "Cybersecurity Specialist", "Cloud Architect", "Robotics Engineer",
                "Semiconductor Engineer", "Biotech Analyst", "Healthcare Technologist", "Climate-Tech Specialist", "EV Systems Engineer",
                "Product Manager", "UX Designer", "Financial Analyst", "Digital Marketing Strategist", "Supply Chain Analyst",
                "Renewable Energy Engineer", "Legal-Tech Analyst", "EdTech Learning Designer", "Game Developer", "Entrepreneur"
        );
        StringBuilder sb = new StringBuilder();
        sb.append("<h3>Top 20 Careers in the Next 10 Years (India)</h3>");
        sb.append("<p>Parents read this first: these careers show where demand is growing and what your child should start now.</p>");
        sb.append("<ol>");
        for (String career : careers) {
            sb.append("<li>").append(escapeHtml(career)).append("</li>");
        }
        sb.append("</ol>");
        return sb.toString();
    }

    private String trimMax(String value, int maxLen) {
        String clean = nz(value).trim();
        if (clean.length() <= maxLen) {
            return clean;
        }
        return clean.substring(0, maxLen);
    }

    private static final class RssItem {
        private String title;
        private String link;
        private String description;
        private String guid;
        private LocalDateTime publishedAt;
    }

    private static final class ScoreCard {
        private int keywordHits;
        private int authorityScore;
        private int freshnessScore;
        private int trendScore;
        private int relevanceScore;
        private int totalScore;
    }
}


