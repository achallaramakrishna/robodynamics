// RDSlideController.java
package com.robodynamics.controller;

import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseSession;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDSlide;
import com.robodynamics.service.RDSlideService;
import com.robodynamics.wrapper.CourseSessionDetailJson;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDCourseSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/slides")
public class RDSlideController {
	
	@Value("${enable.voice.mode}")
    private boolean enableVoiceMode;

	@Autowired
	private RDCourseService courseService;
	
    @Autowired
    private RDSlideService slideService;

    @Autowired
    private RDCourseSessionService courseSessionService;

    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    @GetMapping("/getCourseSessions")
    @ResponseBody
    public Map<String, Object> getCourseSessions(@RequestParam("courseId") int courseId) {
    	
    	System.out.println("inside course sessions.. get method");
        List<RDCourseSession> courseSessions = courseSessionService.getCourseSessionsByCourseId(courseId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("courseSessions", courseSessions);
        return response;
    }

    @GetMapping("/getCourseSessionDetails")
    @ResponseBody
    public Map<String, Object> getCourseSessionDetails(@RequestParam("sessionId") int sessionId) {
    	List<RDCourseSessionDetail> sessionDetails = courseSessionDetailService.findSessionDetailsBySessionId(sessionId);
        List<CourseSessionDetailJson> dtoList = sessionDetails.stream()
            .map(detail -> new CourseSessionDetailJson(detail.getCourseSessionDetailId(), detail.getTopic()))
            .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("sessionDetails", dtoList);
        return response;
    }

    @GetMapping("/getSlidesBySessionDetail")
    @ResponseBody
    public Map<String, Object> getSlidesBySessionDetail(@RequestParam("sessionDetailId") int sessionDetailId) {
        List<RDSlide> slides = slideService.getSlidesBySessionDetailId(sessionDetailId);
        Map<String, Object> response = new HashMap<>();
        response.put("slides", slides);
        return response;
    }
    
    @GetMapping("/list")
    public String listSlides(@RequestParam(required = false) Integer courseSessionDetailId, Model model) {

    	List<RDCourse> courses = courseService.getRDCourses();
    	model.addAttribute("courses",courses);
    	
    	List<RDSlide> slides = null;

        // Fetch session details for the dropdown
     //   List<RDCourseSessionDetail> courseSessionDetails = courseSessionDetailService.getAllCourseSessionDetails();
     //   model.addAttribute("courseSessionDetails", courseSessionDetails);

        if (courseSessionDetailId != null && courseSessionDetailId > 0) {
            slides = slideService.getSlidesBySessionDetailId(courseSessionDetailId);
        }

        if (slides == null || slides.isEmpty()) {
            model.addAttribute("message", "No slides available for the selected session.");
        } else {
            model.addAttribute("slides", slides);
        }

        return "slides/listSlides";
    }

    @GetMapping("/add")
    public String showAddForm(@RequestParam("courseSessionDetailId") int courseSessionDetailId, Model model) {
        RDSlide slide = new RDSlide();
        model.addAttribute("courseSessionDetailId", courseSessionDetailId);
        model.addAttribute("slide", slide);
        return "slides/addEditSlide"; // This will show the addEditSlide.jsp page
    }

    @GetMapping("/edit")
    public String showEditForm(@RequestParam("slideId") int slideId, @RequestParam("courseSessionDetailId") int courseSessionDetailId, Model model) {
        RDSlide slide = slideService.getSlideById(slideId);
        model.addAttribute("courseSessionDetailId", courseSessionDetailId);
        model.addAttribute("slide", slide);
        return "slides/addEditSlide"; // Redirect to the same page for editing
    }

    @PostMapping("/save")
    public String saveSlide(@ModelAttribute("slide") RDSlide slide, 
                            @RequestParam("courseSessionDetailId") int courseSessionDetailId, 
                            RedirectAttributes redirectAttributes) {
        try {
            RDCourseSessionDetail courseSessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
            slide.setCourseSessionDetail(courseSessionDetail);
            slideService.saveRDSlide(slide);
            redirectAttributes.addFlashAttribute("message", "Slide saved successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error saving the slide.");
        }
        return "redirect:/slides/list?courseSessionDetailId=" + courseSessionDetailId;
    }


    @GetMapping("/delete")
    public String deleteSlide(@RequestParam("slideId") int slideId, RedirectAttributes redirectAttributes) {
        try {
            slideService.deleteSlide(slideId);
            redirectAttributes.addFlashAttribute("message", "Slide deleted successfully.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Error deleting the slide.");
        }
        return "redirect:/slides/list";
    }
    
    @PostMapping("/uploadJson")
    public String handleJsonUpload(@RequestParam("file") MultipartFile file,
                                   @RequestParam("courseSessionDetailId") Integer courseSessionDetailId,
                                   RedirectAttributes redirectAttributes) {
    	
    	System.out.println("slide - uploadJson Step 1...");
        // Check if the file is empty
        if (file.isEmpty()) {
            redirectAttributes.addFlashAttribute("error", "Please select a JSON file to upload.");
            return "redirect:/slides/list?courseSessionDetailId=" + courseSessionDetailId;
        }

        try {
            // Validate if courseSessionDetailId is present
            if (courseSessionDetailId == null || courseSessionDetailId <= 0) {
                redirectAttributes.addFlashAttribute("error", "Invalid session detail ID. Please select a valid session detail.");
                return "redirect:/slides/list";
            }

            // Process the JSON file
            slideService.processJson(file, courseSessionDetailId);

            redirectAttributes.addFlashAttribute("message", "JSON file uploaded and processed successfully for session detail ID: " + courseSessionDetailId);
        } catch (Exception e) {
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("error", "Error processing JSON file: " + e.getMessage());
        }

        // Redirect back to the listSlides page
        return "redirect:/slides/list?courseSessionDetailId=" + courseSessionDetailId;
    }

}  