package com.robodynamics.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public class CalendarDTO {
    public static class Slot {
        public String time;        // "HH:mm"
        public String status;      // "FREE" or "BUSY"
        public List<String> courses;
    }
    public static class FreeInterval {
        public String day;         // "Mon".."Sun"
        public String from;        // "HH:mm"
        public String to;          // "HH:mm"
        public double hours;
    }

    private int mentorId;
    private String mentorName;
    private LocalDate weekStart;
    private LocalDate weekEnd;
    private Map<String, List<Slot>> grid;      // day -> slots
    private List<FreeInterval> freeIntervals;  // concise view
    private double weeklyCapacityHours;        // from availability window, optional
    private double bookedHours;
    private double utilizationPct;
	public int getMentorId() {
		return mentorId;
	}
	public void setMentorId(int mentorId) {
		this.mentorId = mentorId;
	}
	public String getMentorName() {
		return mentorName;
	}
	public void setMentorName(String mentorName) {
		this.mentorName = mentorName;
	}
	public LocalDate getWeekStart() {
		return weekStart;
	}
	public void setWeekStart(LocalDate weekStart) {
		this.weekStart = weekStart;
	}
	public LocalDate getWeekEnd() {
		return weekEnd;
	}
	public void setWeekEnd(LocalDate weekEnd) {
		this.weekEnd = weekEnd;
	}
	public Map<String, List<Slot>> getGrid() {
		return grid;
	}
	public void setGrid(Map<String, List<Slot>> grid) {
		this.grid = grid;
	}
	public List<FreeInterval> getFreeIntervals() {
		return freeIntervals;
	}
	public void setFreeIntervals(List<FreeInterval> freeIntervals) {
		this.freeIntervals = freeIntervals;
	}
	public double getWeeklyCapacityHours() {
		return weeklyCapacityHours;
	}
	public void setWeeklyCapacityHours(double weeklyCapacityHours) {
		this.weeklyCapacityHours = weeklyCapacityHours;
	}
	public double getBookedHours() {
		return bookedHours;
	}
	public void setBookedHours(double bookedHours) {
		this.bookedHours = bookedHours;
	}
	public double getUtilizationPct() {
		return utilizationPct;
	}
	public void setUtilizationPct(double utilizationPct) {
		this.utilizationPct = utilizationPct;
	}

    
}
