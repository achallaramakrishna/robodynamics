package com.robodynamics.util;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import com.robodynamics.model.RDLead;

@Converter(autoApply = false)
public class StatusConverter implements AttributeConverter<RDLead.Status, String> {
    @Override public String convertToDatabaseColumn(RDLead.Status s) {
        return s == null ? null : s.db();
    }
    @Override public RDLead.Status convertToEntityAttribute(String db) {
        return RDLead.Status.fromDb(db);
    }
}