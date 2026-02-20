package com.robodynamics.util;

public final class OCRTextNormalizer {

    private OCRTextNormalizer() {}

    public static String normalize(String text) {

        if (text == null) {
            return "";
        }

        return text
            // remove OCR junk symbols but keep structure
            .replaceAll("[^a-zA-Z0-9\\.\\,\\?\\:\\;\\n ]", " ")
            // collapse multiple spaces
            .replaceAll("\\s{2,}", " ")
            // trim leading spaces per line
            .replaceAll("(?m)^\\s+", "")
            .trim();
    }
}
