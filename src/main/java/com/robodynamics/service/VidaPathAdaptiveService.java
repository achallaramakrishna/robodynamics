package com.robodynamics.service;

import com.robodynamics.vidapath.CareerQuestion;
import com.robodynamics.vidapath.FutureCareer;
import com.robodynamics.vidapath.VidaPathAnswerSubmission;
import com.robodynamics.vidapath.VidaPathQuestionPayload;
import com.robodynamics.vidapath.VidaPathSessionState;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class VidaPathAdaptiveService {

    private static final List<String> SECTION_ORDER = List.of(
            "Aptitude",
            "Reasoning");

    private static final int BATCH_SIZE = 6;
    private static final Set<String> CLUSTER_TAGS = Set.of(
            "aptitude", "reasoning", "numeric", "verbal", "logical", "analytical");

    private final VidaPathContentService contentService;
    private final Map<String, VidaPathSession> sessions = new ConcurrentHashMap<>();
    private final Random random = new Random();

    public VidaPathAdaptiveService(VidaPathContentService contentService) {
        this.contentService = contentService;
    }

    public String startSession(Integer studentId, String gradeBand) {
        String token = UUID.randomUUID().toString();
        VidaPathSession session = new VidaPathSession(token, studentId, normalizeGradeBand(gradeBand));
        sessions.put(token, session);
        return token;
    }

    public List<VidaPathQuestionPayload> getNextBatch(String token) {
        VidaPathSession session = resolve(token);
        String section = SECTION_ORDER.get(Math.min(session.currentSectionIndex, SECTION_ORDER.size() - 1));
        List<CareerQuestion> candidates = contentService.getQuestionsBySectionAndGrade(section, session.gradeBand).stream()
                .filter(q -> !session.answeredQuestionIds.contains(q.getQuestionId()))
                .collect(Collectors.toList());
        List<VidaPathQuestionPayload> prioritized = prioritizedBatch(session, candidates);
        if (prioritized.isEmpty() && session.currentSectionIndex < SECTION_ORDER.size() - 1) {
            session.currentSectionIndex++;
            return getNextBatch(token);
        }
        if (prioritized.isEmpty()) {
            return Collections.emptyList();
        }
        return prioritized;
    }

    private List<VidaPathQuestionPayload> prioritizedBatch(VidaPathSession session, List<CareerQuestion> candidates) {
        List<String> preferredTags = session.getTopTags();
        List<VidaPathQuestionPayload> batch = new ArrayList<>();
        for (String tag : preferredTags) {
            for (CareerQuestion candidate : candidates) {
                if (batch.size() >= BATCH_SIZE) {
                    break;
                }
                if (candidate.getTags().contains(tag.toLowerCase())) {
                    batch.add(new VidaPathQuestionPayload(candidate));
                }
            }
            if (batch.size() >= BATCH_SIZE) {
                break;
            }
        }
        if (batch.size() < BATCH_SIZE) {
            Collections.shuffle(candidates, random);
            for (CareerQuestion candidate : candidates) {
                if (batch.size() >= BATCH_SIZE) break;
                VidaPathQuestionPayload payload = new VidaPathQuestionPayload(candidate);
                if (batch.stream().noneMatch(p -> p.getQuestionId().equals(payload.getQuestionId()))) {
                    batch.add(payload);
                }
            }
        }
        return batch;
    }

    public void recordAnswers(String token, List<VidaPathAnswerSubmission> answers) {
        VidaPathSession session = resolve(token);
        if (answers == null || answers.isEmpty()) {
            return;
        }
        for (VidaPathAnswerSubmission submission : answers) {
            CareerQuestion question = contentService.getQuestionById(submission.getQuestionId());
            if (question == null) {
                continue;
            }
            double score = submission.getScore() != null ? submission.getScore() : 1.0;
            session.answeredQuestionIds.add(question.getQuestionId());
            session.answers.add(new VidaPathAnswerRecord(question.getQuestionId(), submission.getRawAnswer(), score, question.getSection(), Instant.now()));
            session.incrementTags(score, question.getTags());
        }
    }

    public VidaPathSessionState getSessionState(String token) {
        VidaPathSession session = resolve(token);
        return new VidaPathSessionState(
                session.token,
                session.studentId,
                session.gradeBand,
                session.currentSectionIndex,
                new ArrayList<>(session.answeredQuestionIds),
                session.snapshot());
    }

    public List<FutureCareer> listFutureCareers() {
        return contentService.getFutureCareers();
    }

    private VidaPathSession resolve(String token) {
        VidaPathSession session = sessions.get(token);
        if (session == null) {
            throw new IllegalArgumentException("Unknown VidaPath session: " + token);
        }
        return session;
    }

    private static class VidaPathSession {
        private final String token;
        private final Integer studentId;
        private final String gradeBand;
        private int currentSectionIndex;
        private final Set<String> answeredQuestionIds = new LinkedHashSet<>();
        private final List<VidaPathAnswerRecord> answers = new ArrayList<>();
        private final Map<String, ProfileScore> profileScores = new HashMap<>();

        private VidaPathSession(String token, Integer studentId, String gradeBand) {
            this.token = token;
            this.studentId = studentId;
            this.gradeBand = gradeBand;
        }

        private void incrementTags(double value, List<String> tags) {
            for (String tag : tags) {
                String normalized = tag.toLowerCase();
                profileScores
                        .computeIfAbsent(normalized, k -> new ProfileScore())
                        .add(value);
            }
        }

        private List<String> getTopTags() {
            return profileScores.entrySet().stream()
                    .filter(entry -> CLUSTER_TAGS.contains(entry.getKey()))
                    .sorted(Comparator.comparingDouble((Map.Entry<String, ProfileScore> entry) -> entry.getValue().average()).reversed())
                    .map(Map.Entry::getKey)
                    .limit(2)
                    .collect(Collectors.toList());
        }

        private Map<String, Double> snapshot() {
            return profileScores.entrySet().stream()
                    .collect(Collectors.toMap(Map.Entry::getKey, entry -> entry.getValue().average()));
        }
    }

    private static class ProfileScore {
        private double total = 0;
        private int count = 0;

        private synchronized void add(double value) {
            total += value;
            count++;
        }

        private double average() {
            return count == 0 ? 0 : total / count;
        }
    }

    private static class VidaPathAnswerRecord {
        private final String questionId;
        private final String rawAnswer;
        private final double score;
        private final String section;
        private final Instant timestamp;

        private VidaPathAnswerRecord(String questionId, String rawAnswer, double score, String section, Instant timestamp) {
            this.questionId = questionId;
            this.rawAnswer = rawAnswer;
            this.score = score;
            this.section = section;
            this.timestamp = timestamp;
        }
    }

    private String normalizeGradeBand(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return "GRADE_10";
        }
        String g = raw.trim().toUpperCase().replace(' ', '_');
        return switch (g) {
            case "8", "GRADE8", "GRADE_8", "CLASS8", "CLASS_8" -> "GRADE_8";
            case "9", "GRADE9", "GRADE_9", "CLASS9", "CLASS_9" -> "GRADE_9";
            case "10", "GRADE10", "GRADE_10", "CLASS10", "CLASS_10" -> "GRADE_10";
            case "11", "12", "UG", "PG", "COLLEGE", "UNDERGRAD", "UNDERGRADUATE", "COLLEGE_STUDENT" -> "COLLEGE";
            default -> "GRADE_10";
        };
    }
}
