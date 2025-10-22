package com.robodynamics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDMentorPayout;
import com.robodynamics.model.RDUser;
import com.robodynamics.model.RDCourseOffering;
import com.robodynamics.service.RDMentorPayoutService;
import com.robodynamics.service.RDUserService;
import com.robodynamics.service.RDCourseOfferingService;

@Controller
@RequestMapping("/finance/mentor-payouts")
public class RDMentorPayoutController {

    @Autowired
    private RDMentorPayoutService payoutService;

    @Autowired
    private RDUserService userService;

    @Autowired
    private RDCourseOfferingService courseOfferingService;

    @GetMapping
    public String listPayouts(Model model) {
        List<RDMentorPayout> payouts = payoutService.findAll();
        List<RDUser> mentors = userService.getRDInstructors();
        List<RDCourseOffering> offerings = courseOfferingService.getAllRDCourseOfferings();

        model.addAttribute("payouts", payouts);
        model.addAttribute("mentors", mentors);
        model.addAttribute("offerings", offerings);
        model.addAttribute("newPayout", new RDMentorPayout());
        return "finance/mentor_payout_list";
    }

    @PostMapping("/save")
    public String savePayout(@ModelAttribute("newPayout") RDMentorPayout payout) {
        if (payout.getPayoutId() == null)
            payoutService.save(payout);
        else
            payoutService.update(payout);
        return "redirect:/finance/mentor-payouts";
    }

    @GetMapping("/edit")
    public String editPayout(@RequestParam("id") Integer id, Model model) {
        RDMentorPayout payout = payoutService.findById(id);
        model.addAttribute("newPayout", payout);
        model.addAttribute("payouts", payoutService.findAll());
        model.addAttribute("mentors", userService.getRDInstructors());
        model.addAttribute("offerings", courseOfferingService.getAllRDCourseOfferings());
        return "finance/mentor_payout_list";
    }

    @GetMapping("/delete")
    public String deletePayout(@RequestParam("id") Integer id) {
        payoutService.delete(id);
        return "redirect:/finance/mentor-payouts";
    }
}
