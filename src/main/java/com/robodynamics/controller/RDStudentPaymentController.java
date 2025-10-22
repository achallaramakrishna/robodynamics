package com.robodynamics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDStudentPayment;
import com.robodynamics.model.RDStudentEnrollment;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDStudentPaymentService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.service.RDStudentEnrollmentService;

@Controller
@RequestMapping("/finance/student-payments")
public class RDStudentPaymentController {

    @Autowired
    private RDStudentPaymentService paymentService;

    @Autowired
    private RDUserService userService;

    @Autowired
    private RDStudentEnrollmentService enrollmentService;
    
    @GetMapping("/generate")
    public String generateMonthlyPayments(@RequestParam(value = "month", required = false) String month) {
        if (month == null || month.isEmpty()) {
            java.time.LocalDate now = java.time.LocalDate.now();
            month = now.getYear() + "-" + String.format("%02d", now.getMonthValue());
        }

        // Get all active enrollments
        List<RDStudentEnrollment> enrollments = enrollmentService.getActiveEnrollments();

        // Loop through enrollments and create payments if not exists
        for (RDStudentEnrollment e : enrollments) {
            boolean exists = paymentService.existsByEnrollmentAndMonth(e.getEnrollmentId(), month);
            if (!exists) {
                RDStudentPayment payment = new RDStudentPayment();
                payment.setEnrollment(e);
                payment.setStudent(e.getStudent());
                payment.setParent(e.getParent());
                payment.setMonthFor(month);
                payment.setAmount(e.getCourseOffering().getFeeAmount()); // example
                payment.setPaymentDate(java.sql.Date.valueOf(java.time.LocalDate.now()));
                payment.setPaymentMode("UPI");
                payment.setStatus("PENDING");
                paymentService.save(payment);
            }
        }

        return "redirect:/finance/student-payments";
    }


    @GetMapping
    public String listPayments(@RequestParam(value = "month", required = false) String month, Model model) {
        if (month == null || month.isEmpty()) {
            java.time.LocalDate now = java.time.LocalDate.now();
            month = now.getYear() + "-" + String.format("%02d", now.getMonthValue());
        }

        // check if month payments already generated
        boolean alreadyGenerated = paymentService.existsForMonth(month);

        List<RDStudentPayment> payments = paymentService.findAll();
        List<RDUser> students = userService.findStudents();
        List<RDUser> parents = userService.findParents();
        List<RDStudentEnrollment> enrollments = enrollmentService.getRDStudentEnrollments();

        model.addAttribute("month", month);
        model.addAttribute("alreadyGenerated", alreadyGenerated);
        model.addAttribute("payments", payments);
        model.addAttribute("students", students);
        model.addAttribute("parents", parents);
        model.addAttribute("enrollments", enrollments);
        model.addAttribute("newPayment", new RDStudentPayment());
        return "finance/student_payment_list";
    }


    @PostMapping("/save")
    public String savePayment(@ModelAttribute("newPayment") RDStudentPayment payment) {
        if (payment.getPaymentId() == null)
            paymentService.save(payment);
        else
            paymentService.update(payment);
        return "redirect:/finance/student-payments";
    }

    @GetMapping("/edit")
    public String editPayment(@RequestParam("id") Integer id, Model model) {
        RDStudentPayment payment = paymentService.findById(id);
        
        model.addAttribute("newPayment", payment);
        model.addAttribute("payments", paymentService.findAll());
        model.addAttribute("students", userService.findStudents());
        model.addAttribute("parents", userService.findParents());
        model.addAttribute("enrollments", enrollmentService.getRDStudentEnrollments());
        return "finance/student_payment_list";
    }

    @GetMapping("/delete")
    public String deletePayment(@RequestParam("id") Integer id) {
        paymentService.delete(id);
        return "redirect:/finance/student-payments";
    }
}
