package com.robodynamics.controller;


import com.robodynamics.service.RDBlogPostService;
import com.robodynamics.service.RDCollectionService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDDemoService;
import com.robodynamics.service.RDMentorService;
import com.robodynamics.service.RDTestimonialService;
import com.robodynamics.model.RDCourse;

import com.robodynamics.model.RDDemo;
import com.robodynamics.dto.RDMentorDTO;
import com.robodynamics.model.RDBlogPost;
import com.robodynamics.model.RDCollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class RDHomeController {

    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDMentorService mentorService;

    @Autowired
    private RDCollectionService collectionService;

    @Autowired
    private RDDemoService demoService;

    @Autowired
    private RDBlogPostService blogPostService;
    
    @Autowired
    private RDTestimonialService testimonialService;


    @GetMapping({ "/", "/home" })
    public String home(@RequestParam(value = "viewer", required = false) String viewer,
                       @RequestParam(value = "q", required = false) String q, Model model, HttpServletRequest req) {

        // 1) viewer toggle
        if (viewer == null || viewer.isBlank()) {
            viewer = "parent"; // Default viewer to "parent" if not provided
        }
        model.addAttribute("viewer", viewer);

        // 2) Fetch collections from the database
        List<RDCollection> collections = collectionService.getCollections();  // Returns List<Collection>
        model.addAttribute("collections", collections);

        // 3) Fetch trending courses from the database
        List<RDCourse> trendingCourses = courseService.getTrendingCourses();  // Returns List<RDCourse>
        model.addAttribute("trendingCourses", trendingCourses);

        // 4) Needs mentors (only shown if viewer == mentor)
        if ("mentor".equals(viewer)) {
            List<RDCourse> needMentors = courseService.getCoursesNeedingMentors();  // Fetch courses needing mentors
            model.addAttribute("coursesNeedingMentors", needMentors);
        }

        // 5) Fetch mentor spotlight from the database
        List<RDMentorDTO> teachers = mentorService.getFeaturedMentors();  // Returns List<Mentor>
        model.addAttribute("featuredTeachers", teachers);

        // 6) Fetch upcoming demos from the database
        List<RDDemo> demos = demoService.getUpcomingDemos();  // Returns List<RDDemo>
        model.addAttribute("upcomingDemos", demos);

        // 7) Fetch blog posts from the database
        List<RDBlogPost> posts = blogPostService.getBlogPosts();  // Returns List<RDBlogPost>
        model.addAttribute("blogPosts", posts);

        // Optional: echo query for search box
        if (q != null) {
            req.setAttribute("q", q);
        }
        
        if (testimonialService != null) {
            model.addAttribute("testimonials", testimonialService.latest(6));
        }

        // Return the home page JSP
        return "home"; // Resolves to /WEB-INF/views/home.jsp
    }
}
