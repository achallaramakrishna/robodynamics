package com.robodynamics.dto;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class RDMentorSearchCriteria {

    private String city;
    private List<String> skillCodes;      // MULTI-SELECT SKILLS
    private List<Integer> grades;         // MULTI-SELECT GRADES
    private String board;
    private String gender;
    private String mode;
    private String enquiryText;
    private Boolean verifiedOnly;

    // -------------------------
    // Constructor
    // -------------------------
    public RDMentorSearchCriteria(String city,
                                  List<String> skillCodes,
                                  List<Integer> grades,
                                  String board,
                                  String gender,
                                  String mode,
                                  String enquiryText,
                                  Boolean verifiedOnly) {

        this.city = trim(city);
        this.skillCodes = skillCodes;
        this.grades = grades;
        this.board = trim(board);
        this.gender = trim(gender);
        this.mode = trim(mode);
        this.enquiryText = trim(enquiryText);
        this.verifiedOnly = verifiedOnly != null && verifiedOnly;
    }

    public RDMentorSearchCriteria() {}

    // -------------------------
    // Getters & Setters
    // -------------------------

    public String getCity() { return city; }
    public void setCity(String city) { this.city = trim(city); }

    public List<String> getSkillCodes() { return skillCodes; }
    public void setSkillCodes(List<String> skillCodes) { this.skillCodes = skillCodes; }

    public List<Integer> getGrades() { return grades; }
    public void setGrades(List<Integer> grades) { this.grades = grades; }

    public String getBoard() { return board; }
    public void setBoard(String board) { this.board = trim(board); }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = trim(gender); }

    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = trim(mode); }

    public String getEnquiryText() { return enquiryText; }
    public void setEnquiryText(String enquiryText) { this.enquiryText = trim(enquiryText); }

    public Boolean getVerifiedOnly() { return verifiedOnly; }
    public void setVerifiedOnly(Boolean verifiedOnly) { this.verifiedOnly = verifiedOnly; }

    // -------------------------
    // Helper: Trim safe
    // -------------------------
    private String trim(String v) {
        return (v == null || v.isBlank()) ? null : v.trim();
    }

    // -------------------------
    // Check if no filters applied
    // -------------------------
    public boolean isEmptyCriteria() {
        return (city == null &&
                (skillCodes == null || skillCodes.isEmpty()) &&
                (grades == null || grades.isEmpty()) &&
                board == null &&
                gender == null &&
                mode == null &&
                enquiryText == null &&
                (verifiedOnly == null || !verifiedOnly));
    }

    // -------------------------
    // Build query string for pagination
    // -------------------------
    public String buildQueryString() {
        StringBuilder sb = new StringBuilder();

        append(sb, "city", city);

        // MULTI-SKILL
        if (skillCodes != null) {
            for (String s : skillCodes) {
                append(sb, "skillCodes", s);
            }
        }

        // MULTI-GRADE
        if (grades != null) {
            for (Integer g : grades) {
                append(sb, "grades", g);
            }
        }

        append(sb, "board", board);
        append(sb, "gender", gender);
        append(sb, "mode", mode);
        append(sb, "enquiryText", safeEncode(enquiryText));

        if (verifiedOnly != null && verifiedOnly) {
            sb.append("verifiedOnly=true&");
        }

        return sb.toString();
    }

    // -------------------------
    // Append helper
    // -------------------------
    private void append(StringBuilder sb, String key, Object value) {
        if (value != null && !value.toString().isBlank()) {
            sb.append(key).append("=").append(value).append("&");
        }
    }

    // -------------------------
    // URL encode enquiry text
    // -------------------------
    private String safeEncode(String v) {
        if (v == null || v.isBlank()) return null;
        try {
            return URLEncoder.encode(v, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            return v;
        }
    }

    public String getQueryString() {
        return buildQueryString();
    }

    @Override
    public String toString() {
        return "RDMentorSearchCriteria{" +
                "city='" + city + '\'' +
                ", skillCodes=" + skillCodes +
                ", grades=" + grades +
                ", board='" + board + '\'' +
                ", gender='" + gender + '\'' +
                ", mode='" + mode + '\'' +
                ", enquiryText='" + enquiryText + '\'' +
                ", verifiedOnly=" + verifiedOnly +
                '}';
    }
}
