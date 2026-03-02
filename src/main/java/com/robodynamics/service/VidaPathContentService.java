package com.robodynamics.service;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvException;
import com.robodynamics.model.VidaPathCareerQuestion;
import com.robodynamics.model.VidaPathFutureCareer;
import com.robodynamics.repository.VidaPathContentRepository;
import com.robodynamics.vidapath.CareerQuestion;
import com.robodynamics.vidapath.FutureCareer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VidaPathContentService {

    private static final Logger LOGGER = LoggerFactory.getLogger(VidaPathContentService.class);

    private final List<CareerQuestion> questionBank = new ArrayList<>();
    private final Map<String, CareerQuestion> questionIndex = new HashMap<>();
    private final List<FutureCareer> futureCareers = new ArrayList<>();
    private final VidaPathContentRepository repository;

    public VidaPathContentService(VidaPathContentRepository repository) {
        this.repository = repository;
    }

    @PostConstruct
    public void init() {
        try {
            if (!loadFromDatabase()) {
                loadFromResources();
            }
        } catch (IOException e) {
            throw new IllegalStateException("Unable to load VidaPath content", e);
        }
    }

    private boolean loadFromDatabase() {
        try {
            List<VidaPathCareerQuestion> dbQuestions = repository.findAllQuestions();
            if (dbQuestions.isEmpty()) {
                LOGGER.info("VidaPath question bank table is empty; falling back to embedded CSV files.");
                return false;
            }
            List<VidaPathFutureCareer> dbCareers = repository.findAllFutureCareers();
            populateQuestionBankFromEntities(dbQuestions);
            populateFutureCareersFromEntities(dbCareers);
            LOGGER.info("Loaded VidaPath content from the database.");
            return true;
        } catch (RuntimeException e) {
            LOGGER.warn("Unable to load VidaPath content from the database, will fall back to embedded CSVs.", e);
            return false;
        }
    }

    private void loadFromResources() throws IOException {
        LOGGER.info("Loading VidaPath content from bundled CSV resources.");
        populateQuestionBankFromCsv("/docs/question_bank_career_discovery.csv");
        populateFutureCareersFromCsv("/docs/future_careers.csv");
    }

    private void populateQuestionBankFromEntities(List<VidaPathCareerQuestion> rows) {
        questionBank.clear();
        questionIndex.clear();
        for (VidaPathCareerQuestion row : rows) {
            CareerQuestion question = new CareerQuestion(
                    row.getSection(),
                    row.getQuestionId(),
                    row.getGradeBand(),
                    row.getQuestionText(),
                    row.getType(),
                    parseTags(row.getTags()),
                    row.getAdaptivityNotes());
            questionBank.add(question);
            questionIndex.put(question.getQuestionId(), question);
        }
    }

    private void populateFutureCareersFromEntities(List<VidaPathFutureCareer> rows) {
        futureCareers.clear();
        for (VidaPathFutureCareer row : rows) {
            futureCareers.add(new FutureCareer(
                    row.getCareerCluster(),
                    row.getCareerName(),
                    row.getDescription(),
                    row.getRequiredSkills(),
                    row.getProjectedGrowthIndia(),
                    row.getProjectedGrowthGlobal(),
                    row.getRelevantGrades()));
        }
    }

    private void populateQuestionBankFromCsv(String resourcePath) throws IOException {
        populateQuestionBankFromRows(readCsv(resourcePath));
    }

    private void populateFutureCareersFromCsv(String resourcePath) throws IOException {
        populateFutureCareersFromRows(readCsv(resourcePath));
    }

    private void populateQuestionBankFromRows(List<String[]> rows) {
        questionBank.clear();
        questionIndex.clear();
        for (String[] row : rows) {
            if (row.length < 6) continue;
            String section = row[0].trim();
            String questionId = row[1].trim();
            String gradeBand = row.length > 6 ? row[2].trim() : "GRADE_10";
            String questionText = row.length > 6 ? row[3].trim() : row[2].trim();
            String type = row.length > 6 ? row[4].trim() : row[3].trim();
            List<String> tags = parseTags(row.length > 6 ? row[5] : row[4]);
            String adaptivityNotes = row.length > 6 ? row[6].trim() : row[5].trim();
            CareerQuestion question = new CareerQuestion(
                    section,
                    questionId,
                    normalizeGradeBand(gradeBand),
                    questionText,
                    type,
                    tags,
                    adaptivityNotes);
            questionBank.add(question);
            questionIndex.put(questionId, question);
        }
    }

    private void populateFutureCareersFromRows(List<String[]> rows) {
        futureCareers.clear();
        for (String[] row : rows) {
            if (row.length < 7) continue;
            futureCareers.add(new FutureCareer(
                    row[0].trim(),
                    row[1].trim(),
                    row[2].trim(),
                    row[3].trim(),
                    row[4].trim(),
                    row[5].trim(),
                    row[6].trim()));
        }
    }

    private List<String[]> readCsv(String resourcePath) throws IOException {
        try (InputStream stream = openResource(resourcePath);
             InputStreamReader reader = new InputStreamReader(stream, StandardCharsets.UTF_8);
             CSVReader csvReader = new CSVReaderBuilder(reader)
                     .withSkipLines(1)
                     .build()) {
            try {
                return csvReader.readAll();
            } catch (CsvException e) {
                throw new IOException("Failed to parse CSV resource " + resourcePath, e);
            }
        }
    }

    private InputStream openResource(String path) throws IOException {
        InputStream stream = VidaPathContentService.class.getResourceAsStream(path);
        if (stream == null) {
            throw new IOException("VidaPath resource not found: " + path);
        }
        return stream;
    }

    private List<String> parseTags(String source) {
        if (source == null || source.isEmpty()) {
            return Collections.emptyList();
        }
        return List.of(source.split("\\s*,\\s*")).stream()
                .map(tag -> tag.trim().toLowerCase(Locale.ROOT))
                .filter(tag -> !tag.isEmpty())
                .collect(Collectors.toList());
    }

    public List<CareerQuestion> getQuestionBank() {
        return Collections.unmodifiableList(questionBank);
    }

    public List<CareerQuestion> getQuestionsBySection(String section) {
        return questionBank.stream()
                .filter(q -> q.getSection().equalsIgnoreCase(section))
                .collect(Collectors.toList());
    }

    public List<CareerQuestion> getQuestionsBySectionAndGrade(String section, String gradeBand) {
        String normalizedBand = normalizeGradeBand(gradeBand);
        return questionBank.stream()
                .filter(q -> q.getSection().equalsIgnoreCase(section))
                .filter(q -> matchesGradeBand(q, normalizedBand))
                .collect(Collectors.toList());
    }

    public CareerQuestion getQuestionById(String questionId) {
        return questionIndex.get(questionId);
    }

    public List<FutureCareer> getFutureCareers() {
        return Collections.unmodifiableList(futureCareers);
    }

    private boolean matchesGradeBand(CareerQuestion question, String gradeBand) {
        if (question == null) {
            return false;
        }
        String rowBand = normalizeGradeBand(question.getGradeBand());
        if ("ALL".equals(rowBand) || rowBand.equalsIgnoreCase(gradeBand)) {
            return true;
        }
        List<String> tags = question.getTags();
        if (tags.isEmpty()) {
            return false;
        }
        String tagNeedle = switch (gradeBand) {
            case "GRADE_8" -> "grade_8";
            case "GRADE_9" -> "grade_9";
            case "GRADE_10" -> "grade_10";
            case "COLLEGE" -> "college";
            default -> "";
        };
        return !tagNeedle.isEmpty() && tags.stream().anyMatch(tag -> tag.equalsIgnoreCase(tagNeedle));
    }

    private String normalizeGradeBand(String raw) {
        if (raw == null || raw.trim().isEmpty()) {
            return "GRADE_10";
        }
        String g = raw.trim().toUpperCase(Locale.ROOT).replace(' ', '_');
        return switch (g) {
            case "8", "GRADE8", "GRADE_8", "CLASS8", "CLASS_8" -> "GRADE_8";
            case "9", "GRADE9", "GRADE_9", "CLASS9", "CLASS_9" -> "GRADE_9";
            case "10", "GRADE10", "GRADE_10", "CLASS10", "CLASS_10" -> "GRADE_10";
            case "11", "12", "UG", "PG", "COLLEGE", "UNDERGRAD", "UNDERGRADUATE" -> "COLLEGE";
            case "ALL" -> "ALL";
            default -> g;
        };
    }
}
