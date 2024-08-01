package com.robodynamics.controller;

import com.robodynamics.model.RDContact;
import com.robodynamics.service.RDContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/contactus")
public class RDContactController {

    @Autowired
    private RDContactService rdContactService;
    


    @PostMapping("/save")
    public void saveRDContact(@RequestBody RDContact rdContact) {
        rdContactService.saveRDContact(rdContact);
    }

    @GetMapping("/all")
    public List<RDContact> getAllRDContacts() {
        return rdContactService.getAllRDContacts();
    }
    
    @GetMapping("/contactus")
    public String contactus() {
        return "contactus";
    }

   
}
