package com.robodynamics.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

public interface RDMarketingAgentService {

    Map<String, Object> upsertLead(LeadUpsertRequest request);

    Map<String, Object> handleInboundWhatsApp(Map<String, String> formParams, String fullRequestUrl, String signature);

    Map<String, Object> runAgent(Long leadId);

    Map<String, Object> createBooking(BookingCreateRequest request);

    Map<String, Object> getKpis(LocalDate fromDate, LocalDate toDateInclusive);

    class LeadUpsertRequest {
        private String parentName;
        private String phoneE164;
        private String studentName;
        private String studentGrade;
        private String board;
        private String city;
        private String sourceChannel;
        private String campaignId;
        private Boolean consentOptIn;
        private Integer ownerUserId;
        private String notes;

        public String getParentName() {
            return parentName;
        }

        public void setParentName(String parentName) {
            this.parentName = parentName;
        }

        public String getPhoneE164() {
            return phoneE164;
        }

        public void setPhoneE164(String phoneE164) {
            this.phoneE164 = phoneE164;
        }

        public String getStudentName() {
            return studentName;
        }

        public void setStudentName(String studentName) {
            this.studentName = studentName;
        }

        public String getStudentGrade() {
            return studentGrade;
        }

        public void setStudentGrade(String studentGrade) {
            this.studentGrade = studentGrade;
        }

        public String getBoard() {
            return board;
        }

        public void setBoard(String board) {
            this.board = board;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getSourceChannel() {
            return sourceChannel;
        }

        public void setSourceChannel(String sourceChannel) {
            this.sourceChannel = sourceChannel;
        }

        public String getCampaignId() {
            return campaignId;
        }

        public void setCampaignId(String campaignId) {
            this.campaignId = campaignId;
        }

        public Boolean getConsentOptIn() {
            return consentOptIn;
        }

        public void setConsentOptIn(Boolean consentOptIn) {
            this.consentOptIn = consentOptIn;
        }

        public Integer getOwnerUserId() {
            return ownerUserId;
        }

        public void setOwnerUserId(Integer ownerUserId) {
            this.ownerUserId = ownerUserId;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }

    class BookingCreateRequest {
        private Long leadId;
        private LocalDateTime slotTime;
        private String mode;
        private String notes;

        public Long getLeadId() {
            return leadId;
        }

        public void setLeadId(Long leadId) {
            this.leadId = leadId;
        }

        public LocalDateTime getSlotTime() {
            return slotTime;
        }

        public void setSlotTime(LocalDateTime slotTime) {
            this.slotTime = slotTime;
        }

        public String getMode() {
            return mode;
        }

        public void setMode(String mode) {
            this.mode = mode;
        }

        public String getNotes() {
            return notes;
        }

        public void setNotes(String notes) {
            this.notes = notes;
        }
    }
}
