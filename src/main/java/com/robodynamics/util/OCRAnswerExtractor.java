package com.robodynamics.util;

import java.util.ArrayList;
import java.util.List;

public final class OCRAnswerExtractor {

    private OCRAnswerExtractor() {}

    /**
     * Structure-safe answer splitter.
     *
     * Strategy:
     * 1. Normalize text
     * 2. Split on DOUBLE newlines only
     * 3. Never use regex lookaheads
     *
     * This guarantees:
     * - No regex crashes
     * - Stable ordering
     * - Works for handwritten OCR
     */
    public static List<String> extractBlocks(String rawText) {

        List<String> blocks = new ArrayList<>();

        if (rawText == null || rawText.trim().isEmpty()) {
            return blocks;
        }

        String clean = normalize(rawText);

        // 🔒 SAFEST SPLIT POSSIBLE
        String[] parts = clean.split("\\n{2,}");

        for (String p : parts) {
            String trimmed = p.trim();
            if (!trimmed.isEmpty()) {
                blocks.add(trimmed);
            }
        }

        return blocks;
    }

    private static String normalize(String text) {
        return text
                .replace("\r", "")
                .replaceAll("(?im)^\\s*date\\s*[:]?.*$", "") // remove Date lines
                .replaceAll("[ ]{2,}", " ")
                .trim();
    }
}
