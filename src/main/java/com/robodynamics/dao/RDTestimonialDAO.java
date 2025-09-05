package com.robodynamics.dao;

import com.robodynamics.model.RDTestimonial;

import java.util.List;
import java.util.Optional;

public interface RDTestimonialDAO {
    Optional<RDTestimonial> findById(Long id);

    List<RDTestimonial> findAllActive();        // ordered by display_order DESC, created_at DESC
    List<RDTestimonial> latest(int limit);      // active only, limited
    List<RDTestimonial> pageActive(int page, int size); // pagination if you need it

    Long save(RDTestimonial t);                 // returns id
    void update(RDTestimonial t);
    void delete(RDTestimonial t);               // hard delete
    int setActive(Long id, boolean active);     // soft active toggle
}
