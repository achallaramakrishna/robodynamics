package com.robodynamics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDSalaryPayout;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDSalaryPayoutService;
import com.robodynamics.service.RDUserService;

@Controller
@RequestMapping("/finance/salary-payouts")
public class RDSalaryPayoutController {

    @Autowired
    private RDSalaryPayoutService salaryService;

    @Autowired
    private RDUserService userService;

    @GetMapping
    public String listSalaries(Model model) {
        List<RDSalaryPayout> payouts = salaryService.findAll();
        List<RDUser> employees = userService.getAllAdminsAndSuperAdmins(); // or findMentors() if needed
        model.addAttribute("payouts", payouts);
        model.addAttribute("employees", employees);
        model.addAttribute("newPayout", new RDSalaryPayout());
        return "finance/salary_payout_list";
    }

    @PostMapping("/save")
    public String saveSalary(@ModelAttribute("newPayout") RDSalaryPayout payout) {
        if (payout.getSalaryId() == null)
            salaryService.save(payout);
        else
            salaryService.update(payout);
        return "redirect:/finance/salary-payouts";
    }

    @GetMapping("/edit")
    public String editSalary(@RequestParam("id") Integer id, Model model) {
        RDSalaryPayout payout = salaryService.findById(id);
        model.addAttribute("newPayout", payout);
        model.addAttribute("payouts", salaryService.findAll());
        model.addAttribute("employees", userService.getAllAdminsAndSuperAdmins());
        return "finance/salary_payout_list";
    }

    @GetMapping("/delete")
    public String deleteSalary(@RequestParam("id") Integer id) {
        salaryService.delete(id);
        return "redirect:/finance/salary-payouts";
    }
}
