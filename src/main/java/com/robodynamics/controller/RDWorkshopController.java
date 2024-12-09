package com.robodynamics.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.model.RDRegistration;
import com.robodynamics.model.RDWorkshop;
import com.robodynamics.service.RDRegistrationService;
import com.robodynamics.service.RDWorkshopService;

@Controller
@RequestMapping("/workshops")
public class RDWorkshopController {

    @Autowired
    private RDWorkshopService workshopService;

    @Autowired
    private RDRegistrationService registrationService;

    private static final String UPLOAD_DIR = "uploads/";

    // Display all workshops
    @GetMapping("/list")
    public String listWorkshops(Model model) {
        List<RDWorkshop> workshops = workshopService.getRDWorkshops();
        model.addAttribute("workshops", workshops);
        return "listWorkshops";
    }

    // Display the form to create or edit a workshop
    @GetMapping("/showForm")
    public ModelAndView workshopForm(@RequestParam(value = "workshopId", required = false) Integer workshopId, Model model) {
        RDWorkshop workshop = (workshopId != null) ? workshopService.getRDWorkshop(workshopId) : new RDWorkshop();
        model.addAttribute("workshop", workshop);
        return new ModelAndView("workshop-form");
    }

    // Save or update a workshop with file uploads
    @PostMapping("/save")
    public String saveWorkshop(
            @ModelAttribute("workshop") RDWorkshop workshop,
            @RequestParam("flyerImageFile") MultipartFile flyerImageFile,
            @RequestParam("courseContentsPdfFile") MultipartFile courseContentsPdfFile) {
        try {
            // Save flyer image file
            if (!flyerImageFile.isEmpty()) {
                String flyerImagePath = saveFile(flyerImageFile, "flyers/");
                workshop.setFlyerImage(flyerImagePath);
            }

            // Save course contents PDF file
            if (!courseContentsPdfFile.isEmpty()) {
                String pdfPath = saveFile(courseContentsPdfFile, "pdfs/");
                workshop.setCourseContentsPdf(pdfPath);
            }

            if (workshop.getWorkshopId() == 0) { // New workshop
                workshop.setCreatedAt(new Date());
            }
            workshop.setUpdatedAt(new Date());
            workshopService.saveRDWorkshop(workshop);
        } catch (IOException e) {
            e.printStackTrace();
            return "redirect:/workshops/error";
        }
        return "redirect:/workshops/list";
    }

    // Delete a workshop
    @GetMapping("/delete")
    public String deleteWorkshop(@RequestParam("workshopId") int workshopId) {
        workshopService.deleteRDWorkshop(workshopId);
        return "redirect:/workshops/list";
    }

    // Show the registration form for a specific workshop
    @GetMapping("/{id}/register")
    public ModelAndView showRegistrationForm(@PathVariable("id") int workshopId, Model model) {
        RDWorkshop workshop = workshopService.getRDWorkshop(workshopId);
        if (workshop == null) {
            return new ModelAndView("error", "message", "Workshop not found.");
        }
        model.addAttribute("workshop", workshop);
        model.addAttribute("registration", new RDRegistration());
        return new ModelAndView("registerWorkshop");
    }

    // Handle registration submission for a specific workshop
    @PostMapping("/{id}/register")
    public String saveRegistration(@PathVariable("id") int workshopId, @ModelAttribute RDRegistration registration, Model model) {
        RDWorkshop workshop = workshopService.getRDWorkshop(workshopId);
        if (workshop == null) {
            model.addAttribute("message", "Workshop not found.");
            return "error";
        }
        registration.setWorkshop(workshop);
        registrationService.saveRDRegistration(registration);
        model.addAttribute("workshop", workshop);
        return "thankYouRegisterWorkshop";
    }

    // View registrations for a specific workshop
    @GetMapping("/{id}/registrations")
    public String viewRegistrations(@PathVariable("id") int workshopId, Model model) {
        RDWorkshop workshop = workshopService.getRDWorkshop(workshopId);
        if (workshop == null) {
            model.addAttribute("message", "Workshop not found.");
            return "error";
        }
        List<RDRegistration> registrations = registrationService.getRDRegistration(workshop);
        model.addAttribute("workshop", workshop);
        model.addAttribute("registrations", registrations);
        return "registrations";
    }

    // Save a file to the server
    private String saveFile(MultipartFile file, String subDirectory) throws IOException {
        String uploadPath = UPLOAD_DIR + subDirectory;
        Path uploadDir = Paths.get(uploadPath);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
        String fileName = file.getOriginalFilename();
        Path filePath = uploadDir.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        return uploadPath + fileName;
    }
}
