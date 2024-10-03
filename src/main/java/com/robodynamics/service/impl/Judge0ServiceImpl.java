package com.robodynamics.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;
import com.robodynamics.service.Judge0Service;

@Service
public class Judge0ServiceImpl implements Judge0Service {

	private static final String JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";
	private static final String API_KEY = "e7c05153eamshee81664854e7926p1cb85ejsn38d81861024c"; // Replace this with your Judge0 API Key

	@Override
	public String executeCode(String code, String languageId) {
		RestTemplate restTemplate = new RestTemplate();

		// Create a request body for the API
		Map<String, Object> requestBody = new HashMap<>();
		requestBody.put("source_code", code);
		requestBody.put("language_id", languageId);
		requestBody.put("stdin", ""); // You can add any input for the program

		// Set up headers
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/json");
		headers.add("X-RapidAPI-Host", "judge0-ce.p.rapidapi.com");
		headers.add("X-RapidAPI-Key", API_KEY); // Replace with your API key

		// Create HTTP entity
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

		// Make a POST request to Judge0 API
		ResponseEntity<Map> response = restTemplate.exchange(JUDGE0_URL, HttpMethod.POST, entity, Map.class);

		if (response.getStatusCode() == HttpStatus.OK) {
			Map<String, Object> result = response.getBody();
			if (result != null && result.get("stdout") != null) {
				return result.get("stdout").toString();
			} else if (result.get("stderr") != null) {
				return result.get("stderr").toString();
			} else {
				return "Error in execution.";
			}
		} else {
			return "Failed to execute the code.";
		}
	}
}
