package com.robodynamics.dao;

import com.robodynamics.dto.RDSearchResultDTO;

import java.util.List;
import java.util.Map;

public interface RDSearchDao {
    List<RDSearchResultDTO> search(Map<String, String> filters);
}
