package com.robodynamics.service;

import com.robodynamics.dto.RDSearchResultDTO;

import java.util.List;
import java.util.Map;

public interface RDSearchService {
    List<RDSearchResultDTO> advancedSearch(Map<String, String> filters);
}
