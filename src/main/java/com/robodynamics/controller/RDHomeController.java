package com.robodynamics.controller;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDProject;
import com.robodynamics.model.RDQuiz;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDProjectService;
import com.robodynamics.service.RDQuizService;
import com.robodynamics.wrapper.ProjectGroup;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class RDHomeController {

    @Autowired
    private RDCourseService courseService;

    @Autowired
    private RDProjectService projectService;

    @Autowired
    private RDQuizService quizService;

    @GetMapping("/")
    public String showHomePage(
            Model model,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "category", required = false, defaultValue = "all") String category
    ) {
        if (query != null && !query.trim().isEmpty()) {
            // Search mode: handle based on category
            List<RDCourse> courses = null;
            List<RDProject> projects = null;
            List<RDQuiz> quizzes = null;

            switch (category) {
                case "courses":
                    courses = courseService.searchCourses(query);
                    break;
                case "projects":
                    projects = projectService.searchProjects(query);
                    break;
                case "quizzes":
                    quizzes = quizService.searchQuizzes(query);
                    break;
                default:
                    // All categories: search across courses, projects, and quizzes
                    courses = courseService.searchCourses(query);
                    projects = projectService.searchProjects(query);
                    quizzes = quizService.searchQuizzes(query);
                    break;
            }

            System.out.println("Query - " + query);
            System.out.println("courses - " + courses);
            System.out.println("projects - " + projects);
            System.out.println("quizzes - " + quizzes);
            
            // Add search results to the model
            model.addAttribute("searchMode", true);
            model.addAttribute("query", query);
            model.addAttribute("category", category);
            model.addAttribute("featuredCourses", courses);
            model.addAttribute("featuredProjects", projects);
            model.addAttribute("featuredQuizzes", quizzes);
        } else {
            // Default mode: show featured and grouped content

            // Retrieve featured lists for horizontal scrolling sections
            List<RDCourse> featuredCourses = courseService.getFeaturedCourses();
            List<RDProject> featuredProjects = projectService.getFeaturedProjects();
            List<RDQuiz> featuredQuizzes = quizService.getFeaturedQuizzes();

            // Retrieve grouped data for both category and grade range
            List<ProjectGroup<RDCourse>> courseCategories = courseService.getCoursesGroupedByCategory();
            List<ProjectGroup<RDCourse>> courseGrades = courseService.getCoursesGroupedByGradeRange();

            List<ProjectGroup<RDProject>> projectCategories = projectService.getProjectsGroupedByCategory();
            List<ProjectGroup<RDProject>> projectGrades = projectService.getProjectsGroupedByGradeRange();

            List<ProjectGroup<RDQuiz>> quizCategories = quizService.getQuizzesGroupedByCategory();
            List<ProjectGroup<RDQuiz>> quizGrades = quizService.getQuizzesGroupedByGradeRange();

            // Add featured data to the model for the scrolling sections
            model.addAttribute("featuredCourses", featuredCourses);
            model.addAttribute("featuredProjects", featuredProjects);
            model.addAttribute("featuredQuizzes", featuredQuizzes);

            // Add grouped data to the model for category and grade range sections
            model.addAttribute("courseCategories", courseCategories);
            model.addAttribute("courseGrades", courseGrades);
            model.addAttribute("projectCategories", projectCategories);
            model.addAttribute("projectGrades", projectGrades);
            model.addAttribute("quizCategories", quizCategories);
            model.addAttribute("quizGrades", quizGrades);

            // Indicate default (non-search) mode
            model.addAttribute("searchMode", false);
        }

        return "index";
    }
    
    @GetMapping("/courses/details")
    public String getCourseDetails(@RequestParam("courseId") Integer courseId, Model model) {
        // Fetch the course details from the service or repository using the course ID
        RDCourse course = courseService.getRDCourse(courseId);
        
        if (course == null) {
            // Handle course not found
            return "error-page"; // Redirect to an error page if the course is not found
        }
        
        // Add course details to the model to pass to the view
        model.addAttribute("course", course);
        
        return "course-details"; // The name of the JSP page to display course details
    }
}
