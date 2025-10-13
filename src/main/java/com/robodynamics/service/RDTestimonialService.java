package com.robodynamics.service;

import com.robodynamics.model.RDTestimonial;

import java.util.List;

public interface RDTestimonialService {
    List<RDTestimonial> latest(int limit);
    List<RDTestimonial> allActive();
    List<RDTestimonial> pageActive(int page, int size);

    RDTestimonial create(RDTestimonial t);
    RDTestimonial update(RDTestimonial t);

    void delete(Long id);              // hard delete
    boolean setActive(Long id, boolean active);
    
    void saveTestimonial(RDTestimonial testimonial);

    RDTestimonial getTestimonialById(Long id);

    List<RDTestimonial> getAllTestimonials();
}
