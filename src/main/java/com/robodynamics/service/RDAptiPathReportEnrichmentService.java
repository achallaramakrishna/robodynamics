package com.robodynamics.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class RDAptiPathReportEnrichmentService {

    private static final Logger log = LoggerFactory.getLogger(RDAptiPathReportEnrichmentService.class);

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired(required = false)
    private OpenAIService openAIService;

    @Value("${aptipath.report.ai.enrichment.enabled:false}")
    private boolean aiEnrichmentEnabled;

    @Value("${aptipath.report.ai.enrichment.maxListItems:4}")
    private int maxListItems;

    public EnrichmentResult enrichReport(Map<String, Object> reportContext) {
        if (!aiEnrichmentEnabled) {
            return EnrichmentResult.skipped("DISABLED");
        }
        if (openAIService == null) {
            return EnrichmentResult.skipped("OPENAI_SERVICE_UNAVAILABLE");
        }
        if (reportContext == null || reportContext.isEmpty()) {
            return EnrichmentResult.skipped("EMPTY_CONTEXT");
        }
        try {
            String contextJson = objectMapper.writeValueAsString(reportContext);
            String prompt = buildPrompt(contextJson);
            String response = openAIService.getResponseFromOpenAI(prompt);
            if (response == null || response.trim().isEmpty()) {
                return EnrichmentResult.skipped("EMPTY_RESPONSE");
            }

            Map<String, Object> payload = parseJsonObject(response);
            if (payload.isEmpty()) {
                return EnrichmentResult.skipped("PARSE_FAILED");
            }

            String summaryLine = normalizeText(payload.get("careerSummaryLine"), 260);
            String studentNarrative = normalizeText(payload.get("studentNarrative"), 420);
            List<String> highlights = normalizeList(payload.get("encouragementHighlights"), maxListItems, 180);
            List<String> actions = normalizeList(payload.get("encouragementActions"), maxListItems, 180);
            List<String> parentGuidance = normalizeList(payload.get("parentGuidance"), maxListItems, 200);
            List<String> followUpQuestions = normalizeList(payload.get("followUpQuestions"), maxListItems, 180);
            boolean applied = !(summaryLine.isEmpty()
                    && studentNarrative.isEmpty()
                    && highlights.isEmpty()
                    && actions.isEmpty()
                    && parentGuidance.isEmpty()
                    && followUpQuestions.isEmpty());

            return new EnrichmentResult(
                    applied,
                    summaryLine,
                    studentNarrative,
                    highlights,
                    actions,
                    parentGuidance,
                    followUpQuestions,
                    applied ? "APPLIED" : "EMPTY_FIELDS");
        } catch (Exception ex) {
            log.warn("AptiPath AI enrichment skipped due to error: {}", ex.getMessage());
            return EnrichmentResult.skipped("ERROR");
        }
    }

    private String buildPrompt(String contextJson) {
        return "You are AptiPath360 Career Discovery report co-pilot.\n"
                + "Use the supplied deterministic scoring context to generate concise coaching text.\n"
                + "Do not change scores or rankings. Keep tone factual, clear, and student-safe.\n"
                + "Return STRICT JSON only (no markdown, no prose) with keys:\n"
                + "{\n"
                + "  \"careerSummaryLine\": string,\n"
                + "  \"studentNarrative\": string,\n"
                + "  \"encouragementHighlights\": [string],\n"
                + "  \"encouragementActions\": [string],\n"
                + "  \"parentGuidance\": [string],\n"
                + "  \"followUpQuestions\": [string]\n"
                + "}\n"
                + "Constraints:\n"
                + "- careerSummaryLine max 1 sentence\n"
                + "- studentNarrative max 3 short sentences\n"
                + "- each list item max 1 sentence\n"
                + "- avoid medical/legal/financial claims\n"
                + "- focus on career discovery for grades 8-12\n"
                + "Context JSON:\n"
                + contextJson;
    }

    private Map<String, Object> parseJsonObject(String rawResponse) {
        if (rawResponse == null) {
            return new LinkedHashMap<>();
        }
        String trimmed = rawResponse.trim();
        int start = trimmed.indexOf('{');
        int end = trimmed.lastIndexOf('}');
        if (start < 0 || end <= start) {
            return new LinkedHashMap<>();
        }
        String json = trimmed.substring(start, end + 1);
        try {
            return objectMapper.readValue(json, new TypeReference<Map<String, Object>>() {});
        } catch (Exception ex) {
            return new LinkedHashMap<>();
        }
    }

    private String normalizeText(Object raw, int maxChars) {
        if (raw == null) {
            return "";
        }
        String value = raw.toString().trim();
        if (value.isEmpty()) {
            return "";
        }
        value = value.replace('\n', ' ').replace('\r', ' ');
        while (value.contains("  ")) {
            value = value.replace("  ", " ");
        }
        if (value.length() > maxChars) {
            return value.substring(0, maxChars).trim();
        }
        return value;
    }

    private List<String> normalizeList(Object raw, int maxItems, int maxCharsPerItem) {
        if (!(raw instanceof List)) {
            return List.of();
        }
        List<?> source = (List<?>) raw;
        List<String> normalized = new ArrayList<>();
        int limit = Math.max(1, maxItems);
        for (Object item : source) {
            if (normalized.size() >= limit) {
                break;
            }
            String text = normalizeText(item, maxCharsPerItem);
            if (!text.isEmpty()) {
                normalized.add(text);
            }
        }
        return normalized;
    }

    public static final class EnrichmentResult {
        private final boolean applied;
        private final String summaryLine;
        private final String studentNarrative;
        private final List<String> highlights;
        private final List<String> actions;
        private final List<String> parentGuidance;
        private final List<String> followUpQuestions;
        private final String status;

        public EnrichmentResult(boolean applied,
                                String summaryLine,
                                String studentNarrative,
                                List<String> highlights,
                                List<String> actions,
                                List<String> parentGuidance,
                                List<String> followUpQuestions,
                                String status) {
            this.applied = applied;
            this.summaryLine = summaryLine == null ? "" : summaryLine;
            this.studentNarrative = studentNarrative == null ? "" : studentNarrative;
            this.highlights = highlights == null ? List.of() : new ArrayList<>(highlights);
            this.actions = actions == null ? List.of() : new ArrayList<>(actions);
            this.parentGuidance = parentGuidance == null ? List.of() : new ArrayList<>(parentGuidance);
            this.followUpQuestions = followUpQuestions == null ? List.of() : new ArrayList<>(followUpQuestions);
            this.status = status == null ? "UNKNOWN" : status;
        }

        public static EnrichmentResult skipped(String status) {
            return new EnrichmentResult(false, "", "", List.of(), List.of(), List.of(), List.of(), status);
        }

        public boolean isApplied() {
            return applied;
        }

        public String getSummaryLine() {
            return summaryLine;
        }

        public String getStudentNarrative() {
            return studentNarrative;
        }

        public List<String> getHighlights() {
            return highlights;
        }

        public List<String> getActions() {
            return actions;
        }

        public List<String> getParentGuidance() {
            return parentGuidance;
        }

        public List<String> getFollowUpQuestions() {
            return followUpQuestions;
        }

        public String getStatus() {
            return status;
        }
    }
}
