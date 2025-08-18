package com.robodynamics.form;

import java.time.LocalDateTime;

import org.springframework.format.annotation.DateTimeFormat;

import com.robodynamics.model.RDTestMode;

//ScheduleForm
public class RDScheduleForm {
	
@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) private LocalDateTime startAt;

@DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) private LocalDateTime endAt;

private RDTestMode mode;

private String venue;

public LocalDateTime getStartAt() {
	return startAt;
}

public void setStartAt(LocalDateTime startAt) {
	this.startAt = startAt;
}

public LocalDateTime getEndAt() {
	return endAt;
}

public void setEndAt(LocalDateTime endAt) {
	this.endAt = endAt;
}

public RDTestMode getMode() {
	return mode;
}

public void setMode(RDTestMode mode) {
	this.mode = mode;
}

public String getVenue() {
	return venue;
}

public void setVenue(String venue) {
	this.venue = venue;
}



}