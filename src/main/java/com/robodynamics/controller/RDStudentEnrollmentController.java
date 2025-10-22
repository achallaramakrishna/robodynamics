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

	@Autowired
	ServletContext servletContext;

	@Autowired
	private RDCourseService courseService;

	@Autowired
	private RDUserService userService;

	@Autowired
	private RDCourseOfferingService courseOfferingService;

	@Autowired
	private RDStudentEnrollmentService studentEnrollmentService;

	@GetMapping("/showCourses")
	public String showCourses(Model theModel) {
		List<RDCourse> courses = courseService.getRDCourses();
		System.out.println(courses);
		theModel.addAttribute("availableCourses", courses);
		return "showCoursesForEnrollment";
	}
	
	@GetMapping("/enroll")
	public String listCourseOfferings(Model theModel) {
		List<RDCourseOffering> courseOfferings = courseOfferingService.getRDCourseOfferings();
		System.out.println(courseOfferings);
		theModel.addAttribute("courseOfferings", courseOfferings);
		return "listCourseOfferings";
	}

	@GetMapping("/list")
	public String listRDStudentEnrollments(Model theModel) {
		List<RDStudentEnrollment> studentEnrollments = studentEnrollmentService.getRDStudentEnrollments();
		System.out.println(studentEnrollments);
		theModel.addAttribute("studentEnrollments", studentEnrollments);
		return "listStudentEnrollments";
	}

	@GetMapping("/listbyparent")
	public String listRDStudentEnrollmentsByParent(Model theModel, HttpSession session) {

		RDUser parent = null;
		if (session.getAttribute("rdUser") != null) {
			parent = (RDUser) session.getAttribute("rdUser");
		}

		System.out.println("user - " + parent);
		List<RDStudentEnrollment> studentEnrollments = studentEnrollmentService
				.getStudentEnrollmentByParent(parent.getUserID());
		System.out.println(studentEnrollments);
		theModel.addAttribute("studentEnrollments", studentEnrollments);
		theModel.addAttribute("user", parent);
		return "listStudentEnrollments";
	}

	@GetMapping("/listbystudent")
	public String listRDStudentEnrollmentsByStudent(Model theModel, HttpSession session) {

		RDUser student = null;
		if (session.getAttribute("rdUser") != null) {
			student = (RDUser) session.getAttribute("rdUser");
		}

		System.out.println("user - " + student);
		List<RDStudentEnrollment> studentEnrollments = studentEnrollmentService
				.getStudentEnrollmentByStudent(student.getUserID());
		System.out.println(studentEnrollments);
		
		theModel.addAttribute("studentEnrollments", studentEnrollments);
		return "listStudentEnrollments";
	}

	@GetMapping("/showCalendar")
	public String showCalendar(Model theModel) {
		List<RDStudentEnrollment> studentEnrollments = studentEnrollmentService.getRDStudentEnrollments();
		System.out.println(studentEnrollments);
		theModel.addAttribute("studentEnrollments", studentEnrollments);
		return "showCalendar";
	}

	@GetMapping(value = "/viewCalendar", produces = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public List<RDStudentEnrollment> getCourseOfferingList() {
		List<RDStudentEnrollment> studentEnrollments = studentEnrollmentService.getRDStudentEnrollments();
		System.out.println("inside view calendar");
		System.out.println(studentEnrollments);

		return studentEnrollments;
	}

	@GetMapping("/showForm")
	public ModelAndView showEnrollmentForm(
	        @RequestParam("courseId") Integer courseId,   // 👈 accept it
	        Model model,
	        HttpSession session) {

	    // 1) Load course (optional, for header)
	    RDCourse course = courseService.getRDCourse(courseId);
	    if (course == null) {
	        // bad id -> go back to course list
	        return new ModelAndView("redirect:/enrollment/showCourses");
	    }
	    model.addAttribute("course", course);

	    // 2) Filter offerings by course
	    List<RDCourseOffering> courseOfferings =
	            courseOfferingService.getRDCourseOfferingsByCourse(courseId); // 👈 add this in service/DAO
	    model.addAttribute("courseOfferings", courseOfferings);

	    // 3) Parent’s children
	    RDUser parent = (RDUser) session.getAttribute("rdUser");
	    if (parent == null) return new ModelAndView("redirect:/login");
	    List<RDUser> childs = userService.getRDChilds(parent.getUserID());
	    model.addAttribute("childs", childs);

	    // 4) Form-backing bean
	    RDStudentEnrollmentForm form = new RDStudentEnrollmentForm();
	    form.setCourseId(courseId); // keep track of selected course
	    model.addAttribute("studentEnrollmentForm", form);

	    return new ModelAndView("student-enrollment-form");
	}


	@GetMapping("/showEnrollmentForm")
	public ModelAndView showEnrollmentForm(Model theModel, HttpSession session,

			@RequestParam("courseOfferingId") Integer courseOfferingId) {

		RDStudentEnrollmentForm studentEnrollmentForm = new RDStudentEnrollmentForm();
		RDCourseOffering courseOffering = courseOfferingService.getRDCourseOffering(courseOfferingId);
		System.out.println(courseOffering);

		RDUser parent = null;
		if (session.getAttribute("rdUser") != null) {
			parent = (RDUser) session.getAttribute("rdUser");
		}

		System.out.println("user - " + parent);
		
		List<RDUser> childs = userService.getRDChilds(parent.getUserID());
		System.out.println(childs);
		theModel.addAttribute("childs", childs);

		studentEnrollmentForm.setCourseOfferingId(courseOfferingId);

		theModel.addAttribute("courseOffering", courseOffering);
		theModel.addAttribute("studentEnrollmentForm", studentEnrollmentForm);

		ModelAndView modelAndView = new ModelAndView("course-enrollment-form");
		return modelAndView;
	}

	@InitBinder
	public void initBinder(WebDataBinder binder) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		dateFormat.setLenient(false);
		binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
	}
	
	@GetMapping("/editForm")
	public String showEditForm(@RequestParam("enrollmentId") Integer enrollmentId, 
	                           Model model, HttpSession session) {

	    RDStudentEnrollment existing = studentEnrollmentService.getRDStudentEnrollment(enrollmentId);
	    if (existing == null) {
	        return "redirect:/enrollment/list";
	    }

	    // Convert to form bean for Spring <form:form>
	    RDStudentEnrollmentForm form = new RDStudentEnrollmentForm();
	    form.setEnrollmentId(existing.getEnrollmentId());
	    form.setCourseOfferingId(existing.getCourseOffering().getCourseOfferingId());
	    form.setStudentId(existing.getStudent().getUserID());
	    form.setParentId(existing.getParent().getUserID());
	    form.setDiscountPercent(existing.getDiscountPercent());
	    form.setDiscountReason(existing.getDiscountReason());
	    form.setFinalFee(existing.getFinalFee());
	    form.setStatus(existing.getStatus());

	    // Populate dropdowns and context data
	    RDCourseOffering selectedOffering = existing.getCourseOffering();
	    model.addAttribute("selectedOffering", selectedOffering);
	    model.addAttribute("students", List.of(existing.getStudent()));
	    model.addAttribute("parents", List.of(existing.getParent()));
	    model.addAttribute("studentEnrollmentForm", form);

	    return "student-enrollment-form";  // reuse the same JSP
	}

	@PostMapping("/save")
	public String saveOrUpdateEnrollment(
	        @ModelAttribute("studentEnrollmentForm") RDStudentEnrollmentForm form,
	        HttpSession session,
	        RedirectAttributes redirectAttributes) {

	    RDCourseOffering offering = courseOfferingService.getRDCourseOffering(form.getCourseOfferingId());
	    double baseFee = offering.getFeeAmount() != null ? offering.getFeeAmount() : 0.0;
	    double discount = form.getDiscountPercent() != null ? form.getDiscountPercent() : 0.0;
	    double finalFee = baseFee - (baseFee * discount / 100);

	    form.setStudentId(form.getStudentId());
	    form.setParentId(form.getParentId());
	    
	   // RDUser parent = userService.getRDUser(form.getParentId());
	   // RDUser student = userService.getRDUser(form.getStudentId());

	    RDStudentEnrollment enrollment;
	    if (form.getEnrollmentId() != 0) {
	        enrollment = studentEnrollmentService.getRDStudentEnrollment(form.getEnrollmentId());
	    } else {
	        enrollment = new RDStudentEnrollment();
	        enrollment.setEnrollmentDate(new Date());
	    }

	    enrollment.setCourseOffering(offering);
	   // enrollment.setParent(parent);
	   // enrollment.setStudent(student);
	    enrollment.setDiscountPercent(discount);
	    enrollment.setDiscountReason(form.getDiscountReason());
	    enrollment.setFinalFee(finalFee);
	    enrollment.setStatus(form.getStatus() != 0 ? form.getStatus() : 1);

	    studentEnrollmentService.saveRDStudentEnrollment(enrollment);

	    redirectAttributes.addFlashAttribute("successMessage", "Enrollment saved successfully!");
	    return "redirect:/enrollment/list";
	}


	@PostMapping("/saveStudentEnrollment")
	public String saveStudentEnrollment(
			HttpSession session, @ModelAttribute("studentEnrollmentForm") RDStudentEnrollmentForm studentEnrollmentForm,
			@RequestParam("studentId") Integer studentId, BindingResult bindingResult) {

	    RDCourseOffering offering = courseOfferingService.getRDCourseOffering(studentEnrollmentForm.getCourseOfferingId());

		System.out.println(studentEnrollmentForm);
		if (bindingResult.hasErrors()) {
			List<FieldError> errors = bindingResult.getFieldErrors();
			for (FieldError error : errors) {
				System.out.println(error.getObjectName() + " - " + error.getDefaultMessage());
			}
			return "showStudentEnrollmentForm";
		}
		RDUser parent = null;
		if (session.getAttribute("rdUser") != null) {
			parent = (RDUser) session.getAttribute("rdUser");
		}

		System.out.println("user - " + parent);

		double baseFee = offering.getFeeAmount() != null ? offering.getFeeAmount() : 0.0;
	    double discount = studentEnrollmentForm.getDiscountPercent() != null ? studentEnrollmentForm.getDiscountPercent() : 0.0;
	    double finalFee = baseFee - (baseFee * discount / 100);

		RDStudentEnrollment theStudentEnrollment = new RDStudentEnrollment();

		System.out.println("i am here");
		RDCourseOffering courseOffering = courseOfferingService
				.getRDCourseOffering(studentEnrollmentForm.getCourseOfferingId());
		System.out.println("course offering id - " + studentEnrollmentForm.getCourseOfferingId());
		courseOffering.setCourseOfferingId(studentEnrollmentForm.getCourseOfferingId());
		RDUser user = userService.getRDUser(studentEnrollmentForm.getStudentId());
		user.setUserID(studentEnrollmentForm.getStudentId());

		RDUser student = userService.getRDUser(studentId);
		student.setUserID(studentId);

		theStudentEnrollment.setEnrollmentDate(new Date());

		theStudentEnrollment.setCourseOffering(courseOffering);
		theStudentEnrollment.setStatus(1);
		theStudentEnrollment.setDiscountPercent(discount);
		theStudentEnrollment.setDiscountReason(studentEnrollmentForm.getDiscountReason());
		theStudentEnrollment.setFinalFee(finalFee);	theStudentEnrollment.setParent(parent);
		theStudentEnrollment.setStudent(student);
		studentEnrollmentService.saveRDStudentEnrollment(theStudentEnrollment);

		return "redirect:/enrollment/listbyparent";
	}

}
