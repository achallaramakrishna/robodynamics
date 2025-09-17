package com.robodynamics.util;

import com.robodynamics.model.RDLead.Audience;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class AudienceConverter implements AttributeConverter<Audience, String> {

    @Override
    public String convertToDatabaseColumn(Audience audience) {
        return (audience != null) ? audience.db() : null;
    }

    @Override
    public Audience convertToEntityAttribute(String dbData) {
        return (dbData != null) ? Audience.fromDb(dbData) : null;
    }
}
