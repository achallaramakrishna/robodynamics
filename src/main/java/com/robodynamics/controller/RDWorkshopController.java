package com.robodynamics.controller;

import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.service.RDRegistrationService;
import com.robodynamics.service.RDWorkshopService;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDRegistration;
import com.robodynamics.model.RDWorkshop;

@Controller
@RequestMapping("/workshops")
public class RDWorkshopController {

    @Autowired
    private RDWorkshopService workshopService;
    
    @Autowired
    private RDRegistrationService registrationService;

	@GetMapping("/list")
    public String listWorkshops(Model model) {
        List<RDWorkshop> workshops = workshopService.getRDWorkshops();
        model.addAttribute("workshops", workshops);
        return "listWorkshops";
    }

	/*
	 * @GetMapping("/createWorkshop") public ModelAndView home(Model m) {
	 * RDAssetCategory assetCategory = new RDAssetCategory();
	 * m.addAttribute("assetCategory", assetCategory); ModelAndView modelAndView =
	 * new ModelAndView("assetcategory-form"); return modelAndView; }
	 */
    
    @GetMapping("/showForm")
    public ModelAndView createWorkshopForm(Model model) {
    	RDWorkshop workshop = new RDWorkshop();
        model.addAttribute("workshop", new RDWorkshop());
        ModelAndView modelAndView = new ModelAndView("workshop-form");
		return modelAndView;
        
    }

    
    @PostMapping("/saveWorkshop")
    public String saveWorkshop(@ModelAttribute("workshop") RDWorkshop workshop) {
    	workshop.setDate(new Date());
        workshopService.saveRDWorkshop(workshop);
        return "redirect:/workshops/list";
    }
    
    @GetMapping("/updateForm")
    public ModelAndView editWorkshop(@RequestParam("workshopId") int workshopId,
    Model theModel) {
    	RDWorkshop workshop = workshopService.getRDWorkshop(workshopId);
        theModel.addAttribute("workshop", workshop);
        ModelAndView modelAndView = new ModelAndView("workshop-form");
		return modelAndView;
    }
    
    @GetMapping("/delete")
    public String deleteWorkshop(@RequestParam("workshopId") int theId) {
    	workshopService.deleteRDWorkshop(theId);
        return "redirect:/workshops/list";
    }
    @GetMapping("/registerForm")
    public ModelAndView registerForm(@RequestParam("workshopId") int theId, Model model) {
        RDWorkshop workshop = workshopService.getRDWorkshop(theId);
        model.addAttribute("workshop", workshop);
        System.out.println(workshop);
        model.addAttribute("registration", new RDRegistration());
        ModelAndView modelAndView = new ModelAndView("registerWorkshop");
		return modelAndView;
    }
   
	/*
	 * public String registerForm(@PathVariable int id, Model model) { RDWorkshop
	 * workshop = workshopService.getRDWorkshop(id); model.addAttribute("workshop",
	 * workshop); System.out.println(workshop); model.addAttribute("registration",
	 * new RDRegistration()); return "registerWorkshop"; }
	 */
    

    @PostMapping("/{id}/register")
    public String saveRegistration(@PathVariable int id, 
    		@ModelAttribute RDRegistration registration, Model model) {
        RDWorkshop workshop = workshopService.getRDWorkshop(id);
        registration.setWorkshop(workshop);
        registrationService.saveRDRegistration(registration);
        
        model.addAttribute("workshop",workshop);
        model.addAttribute("registration",registration);
        
        
        return "thankYouRegisterWorkshop";
    }

	/*
	 * @PostMapping("/{id}/register") public String saveRegistration(@PathVariable
	 * int id,
	 * 
	 * @ModelAttribute RDRegistration registration, Model model) { RDWorkshop
	 * workshop = workshopService.getRDWorkshop(id);
	 * registration.setWorkshop(workshop);
	 * registrationService.saveRDRegistration(registration);
	 * 
	 * model.addAttribute("workshop",workshop);
	 * 
	 * return "redirect:/workshops/" + id + "/registrations"; }
	 */   
    
    @GetMapping("/{id}/registrations")
    public String viewRegistrations(@PathVariable int id, Model model) {
        RDWorkshop workshop = workshopService.getRDWorkshop(id);
	    List<RDRegistration> registrations = registrationService.getRDRegistration(workshop);
        model.addAttribute("workshop", workshop);
        model.addAttribute("registrations", registrations);
        return "registrations";
    }
    
    @PostMapping("/registerWorkshop")
    public ModelAndView registerWorkshop(HttpServletRequest request, HttpServletResponse response) {
        // Retrieve form data from request object
        String name = request.getParameter("name");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String age = request.getParameter("age");
        String workshop = request.getParameter("workshop");

        // Process the registration (e.g., save to database)

        // Redirect to thank you page
        ModelAndView modelAndView = new ModelAndView("thankYou");
        modelAndView.addObject("name", name);
        return modelAndView;
    }
}
