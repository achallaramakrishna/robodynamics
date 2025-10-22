package com.robodynamics.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDTestimonial;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDTestimonialService;
import com.robodynamics.service.RDUserService;

@Controller
public class RDTestimonialController {

    @Autowired
    private RDTestimonialService testimonialService;
    
    @Autowired private RDUserService userService;
    @Autowired private RDCourseService courseService;


    /** Display all testimonials (public page) */
    @GetMapping("/testimonials")
    public String showTestimonials(Model model) {
        List<RDTestimonial> parentTestimonials = testimonialService.getParentStudentTestimonials();
        List<RDTestimonial> mentorTestimonials = testimonialService.getMentorTestimonials();

        model.addAttribute("parentTestimonials", parentTestimonials);
        model.addAttribute("mentorTestimonials", mentorTestimonials);
        model.addAttribute("title", "What Parents, Students & Mentors Say About Robo Dynamics");

        return "testimonials"; // testimonials.jsp
    }


    /** Show form for parent/student testimonial */
    @GetMapping("/testimonial-form")
    public String showParentTestimonialForm(@RequestParam("studentId") Long studentId,
                                            @RequestParam("courseId") Long courseId,
                                            Model model) {
        model.addAttribute("studentId", studentId);
        model.addAttribute("courseId", courseId);
        return "testimonial-form"; // Same JSP, parent/student flow
    }

    /** Show form for mentor testimonial */
    @GetMapping("/mentor/testimonial-form")
    public String showMentorTestimonialForm(@RequestParam("courseId") Long courseId,
                                            @RequestParam("courseOfferingId") Long courseOfferingId,
                                            @SessionAttribute("rdUser") RDUser mentor,
                                            Model model) {
        model.addAttribute("mentor", mentor); // Pass mentor info
        model.addAttribute("courseId", courseId);
        model.addAttribute("courseOfferingId", courseOfferingId);
        return "testimonial-form"; // Reuse same JSP
    }

    /** Handle parent/student testimonial submission */
    @PostMapping("/submit-testimonial")
    public String submitParentTestimonial(@RequestParam("studentId") Long studentId,
                                          @RequestParam("courseId") Long courseId,
                                          @RequestParam("testimonial") String testimonial,
                                          @RequestParam("rating") int rating,
                                          RedirectAttributes redirectAttributes) {
    	
    	RDUser student = userService.getRDUser(studentId.intValue());
        RDCourse course = courseService.getRDCourse(courseId.intValue());

        if (student == null || course == null) {
            redirectAttributes.addFlashAttribute("error", "Invalid student or course reference.");
            return "redirect:/parent/dashboard";
        }
        
        
        RDTestimonial newTestimonial = new RDTestimonial();
        newTestimonial.setStudent(student);
        newTestimonial.setCourse(course);
        newTestimonial.setTestimonial(testimonial);
        newTestimonial.setRating(rating);

        testimonialService.saveTestimonial(newTestimonial);

        redirectAttributes.addFlashAttribute("message",
                "Thank you for sharing your feedback! Your testimonial has been submitted successfully.");
        return "redirect:/parent/dashboard";
    }

    /** Handle mentor testimonial submission */
    @PostMapping("/mentor/submit-testimonial")
    public String submitMentorTestimonial(@RequestParam("mentorId") Long mentorId,
                                          @RequestParam("courseId") Long courseId,
                                          @RequestParam("courseOfferingId") Long courseOfferingId,
                                          @RequestParam("testimonial") String testimonial,
                                          @RequestParam("rating") int rating,
                                          RedirectAttributes redirectAttributes) {

    	 RDUser mentor = userService.getRDUser(mentorId.intValue());
         RDCourse course = courseService.getRDCourse(courseId.intValue());

         if (mentor == null || course == null) {
             redirectAttributes.addFlashAttribute("error", "Invalid mentor or course reference.");
             return "redirect:/mentor/dashboard";
         }
         
    	RDTestimonial newTestimonial = new RDTestimonial();
        newTestimonial.setMentor(mentor); // New field for mentor author
        newTestimonial.setCourse(course);
        newTestimonial.setCourseOfferingId(courseOfferingId);
        newTestimonial.setTestimonial(testimonial);
        newTestimonial.setRating(rating);

        testimonialService.saveTestimonial(newTestimonial);

        redirectAttributes.addFlashAttribute("message",
                "Thank you! Your testimonial has been submitted successfully.");

        return "redirect:/mentor/dashboard";
    }
}
