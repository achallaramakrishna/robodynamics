package com.robodynamics.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.propertyeditors.CustomDateEditor;
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
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.form.RDAssetForm;
import com.robodynamics.form.RDAssetTransactionForm;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDAssetResource;
import com.robodynamics.model.RDAssetTransaction;
import com.robodynamics.model.RDUser;
import com.robodynamics.service.RDAssetCategoryService;
import com.robodynamics.service.RDAssetService;
import com.robodynamics.service.RDAssetTransactionService;
import com.robodynamics.service.RDUserService;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Controller
@RequestMapping("/assettransaction")
public class RDAssetTransactionController {
	
	
	@Autowired
	ServletContext servletContext;
	

	@Autowired
	private RDAssetService assetService;
	
	@Autowired
	private RDUserService userService;
	
	@Autowired
	private RDAssetTransactionService assetTransactionService;


    @GetMapping("/viewHistory")
    public ModelAndView viewHistory(Model theModel, HttpSession session) {
    	
        RDUser parent = null;
        
        System.out.println("hello 111");
		if (session.getAttribute("rdUser") != null) {
			parent = (RDUser) session.getAttribute("rdUser");
	

    	List<RDAssetTransaction> assetTransactionsList 
    	= assetTransactionService.getRDAssetTransactions(parent.getUserID());
        System.out.println("hello 111 " + assetTransactionsList.size());

        theModel.addAttribute("assetTransactionsList", assetTransactionsList);
		}
        System.out.println("hello 111");

		ModelAndView modelAndView = new ModelAndView("view-asset-transaction-form");
		return modelAndView;
    }
    
    @GetMapping("/bookForm")
    public ModelAndView bookLegos(@RequestParam("assetId") int theId, @RequestParam("userId") int theUserId,
    	@RequestParam("transactionType") String transactionType, Model theModel) {
    	RDAsset asset = assetService.getRDAsset(theId);
        theModel.addAttribute("asset", asset);
        
        RDUser user = userService.getRDUser(theUserId);
        
        RDAssetTransactionForm assetTransactionForm = new RDAssetTransactionForm();
        assetTransactionForm.setAssetId(theId);
        assetTransactionForm.setAssetName(asset.getAssetName());
        assetTransactionForm.setUserID(theUserId);
        assetTransactionForm.setUserName(user.getFirstName() + " " + user.getLastName());
        assetTransactionForm.setStatus(transactionType);
        System.out.println("User - " + user);
        System.out.println("Transaction Type : " + transactionType);
        
        theModel.addAttribute("assetTransactionForm", assetTransactionForm);
		
		ModelAndView modelAndView = new ModelAndView("asset-transaction-form");
		return modelAndView;
    }
    
    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }
    
	@PostMapping("/saveAssetTransaction")
    public String saveAssetTransaction(@ModelAttribute("assetTransactionForm") RDAssetTransactionForm assetTransactionForm,
    		BindingResult bindingResult) {
		
		System.out.println(assetTransactionForm);
        if(bindingResult.hasErrors()) {
        	 List<FieldError> errors = bindingResult.getFieldErrors();
        	    for (FieldError error : errors ) {
        	        System.out.println (error.getObjectName() + " - " + error.getDefaultMessage());
        	    }
        	  	return "bookForm";
        }
    	RDAssetTransaction theAssetTransaction = new RDAssetTransaction();

        System.out.println("i am here");
    	RDAsset asset = assetService.getRDAsset(assetTransactionForm.getAssetId());
    	System.out.println("asset id - " + assetTransactionForm.getAssetId());
    	asset.setAssetId(assetTransactionForm.getAssetId());
        RDUser user = userService.getRDUser(assetTransactionForm.getUserID());
    	user.setUserID(assetTransactionForm.getUserID());
    	
    	try {
    		SimpleDateFormat curFormater = new SimpleDateFormat("yyyy-MM-dd",Locale.US); 
    		Date dateObj = curFormater.parse(assetTransactionForm.getTransactionStartDate());
    		
    		System.out.println("Transaction Start date : " + assetTransactionForm.getTransactionStartDate());
    		
			theAssetTransaction.setTransactionDate(dateObj);
   		
			theAssetTransaction.setTransactionStartDate(dateObj);
    	} catch (ParseException e) {
			
			e.printStackTrace();
		}
    	theAssetTransaction.setAsset(asset);
    	theAssetTransaction.setUser(user);
    	theAssetTransaction.setStatus(assetTransactionForm.getStatus());
    	
		assetTransactionService.saveRDAssetTransaction(theAssetTransaction);


        
        return "redirect:/parent/legos";
    }
	
}
