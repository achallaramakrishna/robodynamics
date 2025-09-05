package com.robodynamics.service.impl;

import com.robodynamics.dao.RDTestimonialDAO;
import com.robodynamics.model.RDTestimonial;
import com.robodynamics.service.RDTestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional // class-level transactional: uses current session
public class RDTestimonialServiceImpl implements RDTestimonialService {

    private final RDTestimonialDAO dao;

    @Autowired
    public RDTestimonialServiceImpl(RDTestimonialDAO dao) {
        this.dao = dao;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDTestimonial> latest(int limit) {
        return dao.latest(limit);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDTestimonial> allActive() {
        return dao.findAllActive();
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDTestimonial> pageActive(int page, int size) {
        return dao.pageActive(page, size);
    }

    @Override
    public RDTestimonial create(RDTestimonial t) {
        Long id = dao.save(t);
        t.setId(id);
        return t;
    }

    @Override
    public RDTestimonial update(RDTestimonial t) {
        if (t.getId() == null) throw new IllegalArgumentException("id is required");
        dao.update(t);
        return t;
    }

    @Override
    public boolean delete(Long id) {
        return dao.findById(id).map(t -> { dao.delete(t); return true; }).orElse(false);
    }

    @Override
    public boolean setActive(Long id, boolean active) {
        return dao.setActive(id, active) > 0;
    }
}
