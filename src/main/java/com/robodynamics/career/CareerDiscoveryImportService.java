package com.robodynamics.career;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import com.robodynamics.career.CareerDiscoveryRows.CareerQuestionRow;
import com.robodynamics.career.CareerDiscoveryRows.FutureCareerRow;

@Component
public class CareerDiscoveryImportService {

    private static final String QUESTION_BANK_RESOURCE = "data/question_bank_career_discovery.csv";
    private static final String FUTURE_CAREERS_RESOURCE = "data/future_careers.csv";

    public List<CareerQuestionRow> loadQuestionBank() {
        return loadCsv(QUESTION_BANK_RESOURCE, CareerQuestionRow::fromCsv);
    }

    public List<FutureCareerRow> loadFutureCareers() {
        return loadCsv(FUTURE_CAREERS_RESOURCE, FutureCareerRow::fromCsv);
    }

    private <T> List<T> loadCsv(String resourcePath, CsvRowMapper<T> mapper) {
        try (InputStream input = new ClassPathResource(resourcePath).getInputStream();
             BufferedReader reader = new BufferedReader(new InputStreamReader(input, StandardCharsets.UTF_8))) {
            List<T> rows = new ArrayList<>();
            String header = reader.readLine(); // skip header
            if (header == null) {
                return Collections.emptyList();
            }
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }
                String[] parts = splitCsv(line);
                T row = mapper.map(parts);
                if (row != null) {
                    rows.add(row);
                }
            }
            return rows;
        } catch (IOException e) {
            throw new IllegalStateException("Failed to load resource " + resourcePath, e);
        }
    }

    private String[] splitCsv(String line) {
        List<String> tokens = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuote = false;
        for (int i = 0; i < line.length(); i++) {
            char ch = line.charAt(i);
            if (ch == '\"') {
                inQuote = !inQuote;
            } else if (ch == ',' && !inQuote) {
                tokens.add(current.toString().trim());
                current.setLength(0);
            } else {
                current.append(ch);
            }
        }
        tokens.add(current.toString().trim());
        return tokens.toArray(new String[0]);
    }

    interface CsvRowMapper<T> {
        T map(String[] columns);
    }
}
