package com.robodynamics.dao;

import java.util.List;

import com.robodynamics.model.RDContentRadarSource;

public interface RDContentRadarSourceDao {

    void save(RDContentRadarSource source);

    RDContentRadarSource findById(Long sourceId);

    List<RDContentRadarSource> findAll();

    List<RDContentRadarSource> findActive();

    void deleteById(Long sourceId);
}
