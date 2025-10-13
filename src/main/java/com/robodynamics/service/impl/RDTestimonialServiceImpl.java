package com.robodynamics.service.impl;

import com.robodynamics.dao.RDCourseDao;
import com.robodynamics.dao.RDTestimonialDAO;
import com.robodynamics.dao.RDUserDao;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDTestimonial;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDTestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional // class-level transactional: uses current session
public class RDTestimonialServiceImpl implements RDTestimonialService {

    @Autowired private RDTestimonialDAO dao;
    @Autowired private RDUserDao userDao;
    @Autowired private RDCourseDao courseDao;

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
    public void delete(Long id) {
    	RDTestimonial t = dao.findById(id);
    	if(t!=null) 
    		dao.delete(t);
    	
    }

    @Override
    public boolean setActive(Long id, boolean active) {
        return dao.setActive(id, active) > 0;
    }

	@Override
	@Transactional
	public void saveTestimonial(RDTestimonial testimonial) {
		dao.save(testimonial);
		
	}

	@Override
	@Transactional
	public RDTestimonial getTestimonialById(Long id) {
		
		return dao.findById(id);
	}

	@Override
	@Transactional
	public List<RDTestimonial> getAllTestimonials() {
		
		List<RDTestimonial> testimonials = dao.getAllTestimonials();

	    for (RDTestimonial t : testimonials) {
	        RDUser student = userDao.getRDUser(t.getStudentId().intValue());
	        if (student != null) {
	            t.setStudentName(student.getFirstName() + " " + student.getLastName());

	            // Parent name (dad_user_id or mom_user_id)
	            String parentName = "";
	            if (student.getDad() != null) {
	                RDUser dad = userDao.getRDUser(student.getDad().getUserID());
	                parentName += dad.getFirstName() + " " + dad.getLastName();
	            }
	            if (student.getMom() != null) {
	                RDUser mom = userDao.getRDUser(student.getMom().getUserID());
	                if (!parentName.isEmpty()) parentName += " & ";
	                parentName += mom.getFirstName() + " " + mom.getLastName();
	            }
	            t.setParentName(parentName.isEmpty() ? "N/A" : parentName);
	        }
	     // Course name
	        RDCourse course = courseDao.getRDCourse(t.getCourseId().intValue());
	        t.setCourseName(course != null ? course.getCourseName() : "Course Participant");
	    }

	    
	    return testimonials;

	}
}
