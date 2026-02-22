package com.robodynamics.service;

import java.util.Map;

public interface RDModuleAccessService {

    boolean hasModuleAccess(Integer userId, String moduleCode);

    Map<String, Boolean> getModuleAccessMap(Integer userId);
}
