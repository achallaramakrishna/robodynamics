package com.robodynamics.controller;


import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.form.RDExistingUserForm;
import com.robodynamics.form.RDNewUserForm;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDCompetition;
import com.robodynamics.model.RDCompetitionParticipant;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDCompetitionJudgeService;
import com.robodynamics.service.RDCompetitionParticipantService;
import com.robodynamics.service.RDCompetitionService;
import com.robodynamics.service.RDSubmissionService;
import com.robodynamics.service.RDUserService;

import java.util.*;

@Controller
@RequestMapping("/competition")
public class RDCompetitionController {

    @Autowired
    private RDCompetitionService competitionService;

    @Autowired
    private RDCompetitionParticipantService competitionParticipantService;

    @Autowired
    private RDCompetitionJudgeService competitionJudgeService;
    
    @Autowired
    private RDUserService userService;

    @Autowired
    private RDSubmissionService rdSubmissionService;

    
    @PostMapping("/saveCompetition")
    public String createCompetition(@ModelAttribute("newCompetition") RDCompetition newCompetition
    		, BindingResult
            bindingResult) {
    	if (bindingResult.hasErrors()) {
    		bindingResult
    		.getFieldErrors()
    		.stream()
    		.forEach(f -> System.out.println(f.getField() + ": " + f.getDefaultMessage()));
            return "redirect:/competition/list";
        }
    	competitionService.saveRDCompetition(newCompetition);
        return "redirect:/competition/list";
    }
    
    @PostMapping("/update")
    public String updateCompetition(@ModelAttribute("competition") RDCompetition competition, BindingResult
            bindingResult) {
    	competitionService.saveRDCompetition(competition);
        return "redirect:/competition/list";
    }
    
    @GetMapping("/{id}/delete")
    public String deleteCompetition(@PathVariable int id) {
    	competitionService.deleteRDCompetition(id);
        return "redirect:/competition/list";
    }


    @GetMapping("/list")
    public String listCompetitions(Model model) {
        List<RDCompetition> competitions = competitionService.getRDCompetitions();
        model.addAttribute("competitions", competitions);
        model.addAttribute("newCompetition", new RDCompetition()); // Initialize the newCompetition object
        model.addAttribute("competition", new RDCompetition()); // Initialize the newCompetition object

        return "manageCompetitions";
    }

    @GetMapping("/{id}/register")
    public String registerForm(@PathVariable int id, Model model) {
        RDCompetition competition = competitionService.getRDCompetition(id);
                
        model.addAttribute("competition", competition);
        model.addAttribute("existingUser", new RDExistingUserForm());
        model.addAttribute("newUser", new RDNewUserForm());
        
        return "registerCompetition";
    }

    @PostMapping("/{id}/register")
    public String saveParticipant(@PathVariable int id, @ModelAttribute RDCompetitionParticipant participant) {
    	RDCompetition competition = competitionService.getRDCompetition(id);
                
        participant.setCompetition(competition);
        competitionParticipantService.saveRDCompetitionParticipant(participant);
        return "redirect:/competition/" + id + "/registrations";
    }
    
    @PostMapping("/{competitionId}/register/existing")
    public String registerExistingUser(@PathVariable int competitionId, @ModelAttribute("existingUser") RDExistingUserForm existingUserForm, Model model) {
        // Handle existing user registration logic
        // Validate user credentials and register for the competition
        // Redirect to the competition page or success page
    	System.out.println("hello existing user" + competitionId);
    	
    	System.out.println(existingUserForm);
    	RDCompetition competition = competitionService.getRDCompetition(competitionId);
    	RDUser rdUser = userService.getRDUser(existingUserForm.getUserName(), existingUserForm.getPassword());
    	
    	RDCompetitionParticipant competitionParticipant = new RDCompetitionParticipant();
    	competitionParticipant.setCompetition(competition);
    	competitionParticipant.setUser(rdUser);
    	competitionParticipantService.saveRDCompetitionParticipant(competitionParticipant);
        return "competitionRegistrationSuccess";
    }

    @PostMapping("/{competitionId}/register/new")
    public String registerNewUser(@PathVariable int competitionId, @ModelAttribute("newUser") RDNewUserForm newUserForm, Model model) {
        // Handle new user registration logic
        // Create a new user and register for the competition
        // Redirect to the competition page or success page
    	
    	RDCompetition competition = competitionService.getRDCompetition(competitionId);
    	RDUser rdUser = new RDUser();
    	
    	rdUser.setFirstName(newUserForm.getFirstName());
    	rdUser.setLastName(newUserForm.getLastName());
    	rdUser.setEmail(newUserForm.getEmail());
    	rdUser.setPassword(newUserForm.getPassword());
    	rdUser.setAddress(newUserForm.getAddress());
    	rdUser.setCellPhone(newUserForm.getCellPhone());
    	rdUser.setCity(newUserForm.getCity());
    	rdUser.setState(newUserForm.getState());
    	rdUser.setUserName(newUserForm.getUserName());
    	// student - to change this to enum
    	rdUser.setProfile_id(5);
    	
    	userService.registerRDUser(rdUser);
    	
    	RDUser user = userService.getRDUser(newUserForm.getUserName(),newUserForm.getPassword());
    	
    	System.out.println("hello existing user" + competitionId);
    	System.out.println(newUserForm);
    	
    	RDCompetitionParticipant competitionParticipant = new RDCompetitionParticipant();
    	competitionParticipant.setCompetition(competition);
    	competitionParticipant.setUser(user);
    	competitionParticipantService.saveRDCompetitionParticipant(competitionParticipant);
    	
    	
    	return "competitionRegistrationSuccess";
    }


    @GetMapping("/{id}/registrations")
    public String viewRegistrations(@PathVariable int id, Model model) {
        List<RDCompetitionParticipant> participants = competitionParticipantService.getRDCompetitionParticipants(id);
        model.addAttribute("participants", participants);
        return "competition/registrations";
    }
}
