package com.robodynamics.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class JsonNodeConverter implements AttributeConverter<JsonNode, String> {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(JsonNode jsonNode) {
        try {
            return (jsonNode == null) ? null : objectMapper.writeValueAsString(jsonNode);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Error converting JsonNode to String", ex);
        }
    }

    @Override
    public JsonNode convertToEntityAttribute(String jsonString) {
        try {
            return (jsonString == null || jsonString.isEmpty()) ? null : objectMapper.readTree(jsonString);
        } catch (Exception ex) {
            throw new IllegalArgumentException("Error converting String to JsonNode", ex);
        }
    }
}
