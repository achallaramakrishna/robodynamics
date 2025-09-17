package com.robodynamics.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

/**
 * Minimal FC-compatible event payload:
 *  - top-level: id, title, start, end, color (optional)
 *  - everything else goes into extendedProps
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CalendarEventDTO {

    @JsonProperty("id")
    private String id;

    @JsonProperty("title")
    private String title;

    /** ISO 8601 "yyyy-MM-dd'T'HH:mm:ss" */
    @JsonProperty("start")
    private String start;

    /** ISO 8601 "yyyy-MM-dd'T'HH:mm:ss" */
    @JsonProperty("end")
    private String end;

    /** Optional FullCalendar color field */
    @JsonProperty("color")
    private String color;

    /** Arbitrary extras for UI — FC reads them via event.extendedProps */
    @JsonProperty("extendedProps")
    private Map<String, Object> extendedProps;

    // ---- getters/setters ----
    public String getId() { return id; }
    public CalendarEventDTO setId(String id) { this.id = id; return this; }

    public String getTitle() { return title; }
    public CalendarEventDTO setTitle(String title) { this.title = title; return this; }

    public String getStart() { return start; }
    public CalendarEventDTO setStart(String start) { this.start = start; return this; }

    public String getEnd() { return end; }
    public CalendarEventDTO setEnd(String end) { this.end = end; return this; }

    public String getColor() { return color; }
    public CalendarEventDTO setColor(String color) { this.color = color; return this; }

    public Map<String, Object> getExtendedProps() { return extendedProps; }
    public CalendarEventDTO setExtendedProps(Map<String, Object> extendedProps) { this.extendedProps = extendedProps; return this; }
}
