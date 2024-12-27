package com.robodynamics.controller;

import java.time.LocalDateTime;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import com.robodynamics.model.HelloWorld;



/**
 * @author Achalla Ramakrishna
 */
@Controller
public class DemoController {
	 @RequestMapping("/vedicmathdemo")
	    public String handler(Model model) {
	        return "demo/vedicmath1";
	    }
	}