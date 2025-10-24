package com.robodynamics.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.robodynamics.dto.RDCourseOfferingDTO;
import com.robodynamics.form.RDAssetTransactionForm;
import com.robodynamics.form.RDCourseForm;
import com.robodynamics.form.RDStudentEnrollmentForm;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDCourse;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDCourseOfferingService;
import com.robodynamics.service.RDCourseService;
import com.robodynamics.service.RDStudentEnrollmentService;
import com.robodynamics.service.RDUserService;

@Controller
@RequestMapping("/enrollment")
public class RDStudentEnrollmentController {

    @Autowired private RDCourseService courseService;
    @Autowired private RDUserService userService;
    @Autowired private RDCourseOfferingService offeringService;
    @Autowired private RDStudentEnrollmentService enrollmentService;

    // 1) Show course picker + student (children) list
    @GetMapping("/showCourses")
    public String showCourses(Model model, HttpSession session) {
        model.addAttribute("availableCourses", courseService.getRDCourses());

        RDUser parent = (RDUser) session.getAttribute("rdUser");
        if (parent == null) return "redirect:/login";
        model.addAttribute("childs", userService.getRDChilds(parent.getUserID()));

        model.addAttribute("studentEnrollmentForm", new RDStudentEnrollmentForm());
        return "showCoursesForEnrollment";
    }

    // 2) AJAX: offerings for a course (DTOs)
    @GetMapping(value="/getCourseOfferings", produces=MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public List<RDCourseOfferingDTO> getCourseOfferings(@RequestParam int courseId) {
        return offeringService.getDTOsByCourse(courseId);
    }

    // 3) Submit selection -> enroll
    @PostMapping("/enroll")
    public String enroll(@ModelAttribute("studentEnrollmentForm") RDStudentEnrollmentForm form,
                         HttpSession session, RedirectAttributes ra) {

        RDUser parent = (RDUser) session.getAttribute("rdUser");
        if (parent == null) return "redirect:/login";

        if (form.getCourseOfferingId()==0 || form.getStudentId()==0) {
            ra.addFlashAttribute("error", "Please select course, offering and student.");
            return "redirect:/enrollment/showCourses";
        }

        if (enrollmentService.existsByStudentAndOffering(form.getStudentId(), form.getCourseOfferingId())) {
            ra.addFlashAttribute("error", "This student is already enrolled in the selected offering.");
            return "redirect:/enrollment/showCourses";
        }

        RDCourseOffering offering = offeringService.getRDCourseOffering(form.getCourseOfferingId());
        RDUser student = userService.getRDUser(form.getStudentId());

        double baseFee = offering.getFeeAmount()!=null ? offering.getFeeAmount() : 0.0;
        double discount = form.getDiscountPercent()!=null ? form.getDiscountPercent() : 0.0;
        double finalFee = baseFee - (baseFee * discount / 100.0);

        RDStudentEnrollment e = new RDStudentEnrollment();
        e.setCourseOffering(offering);
        e.setStudent(student);
        e.setParent(parent);
        e.setEnrollmentDate(new Date());
        e.setDiscountPercent(discount);
        e.setDiscountReason(form.getDiscountReason());
        e.setFinalFee(finalFee);
        e.setStatus(1); // Active

        enrollmentService.saveRDStudentEnrollment(e);

        ra.addFlashAttribute("success", "Enrollment completed!");
        return "redirect:/enrollment/listbyparent";
    }
    
 // 4️⃣ Show all enrollments for this parent
    @GetMapping("/listbyparent")
    public String listByParent(Model model, HttpSession session) {
        RDUser parent = (RDUser) session.getAttribute("rdUser");
        if (parent == null) return "redirect:/login";

        List<RDStudentEnrollment> enrollments = enrollmentService.getStudentEnrollmentByParent(parent.getUserID());
        model.addAttribute("enrollments", enrollments);
        model.addAttribute("title", "My Enrollments");

        return "listParentEnrollments";  // JSP page
    }

    
    @GetMapping("/showEnrollmentForm")
    public String showEnrollmentForm(@RequestParam("courseId") int courseId,
                                     @RequestParam("courseOfferingId") int courseOfferingId,
                                     @RequestParam("studentId") int studentId,
                                     Model model,
                                     HttpSession session) {

        RDUser parent = (RDUser) session.getAttribute("rdUser");
        if (parent == null) {
            return "redirect:/login";
        }

        // Fetch course, offering, and student
        RDCourse course = courseService.getRDCourse(courseId);
        RDCourseOffering offering = offeringService.getRDCourseOffering(courseOfferingId);
        RDUser student = userService.getRDUser(studentId);

        if (course == null || offering == null || student == null) {
            model.addAttribute("error", "Invalid course, offering, or student selection.");
            return "showCoursesForEnrollment";
        }

        // Prepare form object
        RDStudentEnrollmentForm form = new RDStudentEnrollmentForm();
        form.setCourseId(course.getCourseId());
        form.setCourseName(course.getCourseName());
        form.setCourseOfferingId(offering.getCourseOfferingId());
        form.setStudentId(student.getUserID());
        form.setParentId(parent.getUserID());
        form.setFinalFee(offering.getFeeAmount());

        model.addAttribute("studentEnrollmentForm", form);
        model.addAttribute("course", course);
        model.addAttribute("offering", offering);
        model.addAttribute("student", student);

        return "showEnrollmentForm"; // 👉 JSP: /WEB-INF/views/showEnrollmentForm.jsp
    }

}
