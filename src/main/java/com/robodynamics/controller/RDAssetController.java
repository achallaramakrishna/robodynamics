package com.robodynamics.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;

import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.robodynamics.form.RDAssetForm;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDAssetResource;
import com.robodynamics.service.RDAssetCategoryService;
import com.robodynamics.service.RDAssetService;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.util.*;

@Controller
@RequestMapping("/asset")
public class RDAssetController {
	
	
	@Autowired
	ServletContext servletContext;
	

	@Autowired
	private RDAssetService service;
	
	@Autowired
	private RDAssetCategoryService assetCategoryService;

	@GetMapping("/list")
	    public String listAssets(Model theModel) {
	        List < RDAsset > assets = service.getRDAssets();
	        theModel.addAttribute("assets", assets);
	        return "listAssets";
	    }
	@GetMapping("/showForm")
	public ModelAndView home(Model theModel) {
		
		List < RDAssetCategory > assetCategories = assetCategoryService.getRDAssetCategories();
		theModel.addAttribute("assetCategories", assetCategories);

		theModel.addAttribute("assetForm", new RDAssetForm());
		
		ModelAndView modelAndView = new ModelAndView("asset-form");
		return modelAndView;
	}
	
	@PostMapping("/saveAsset")
    public String saveAsset(@ModelAttribute("assetForm") RDAssetForm assetForm,
    		BindingResult result) {
        if(result.hasErrors()) {
        	return "showForm";
        }
        MultipartFile imageFile = assetForm.getImageFile();

        System.out.println("asset id : " + assetForm.getAssetId());

        System.out.println("asset name : " + assetForm.getAssetName());
        System.out.println("asset category id : " + assetForm.getAssetCategoryId());
        RDAsset theAsset = null;
      
        if(assetForm.getAssetId() != 0) {
    	  theAsset = service.getRDAsset(assetForm.getAssetId());
    	  imageFile = null;
      } else {
    	theAsset = new RDAsset();
      }
    	
    	theAsset.setAssetName(assetForm.getAssetName());
    	theAsset.setAssetQuantity(assetForm.getAssetQuantity());
    	RDAssetCategory assetCategory = new RDAssetCategory();
    	assetCategory.setAssetCategoryId(assetForm.getAssetCategoryId());
    	
    	theAsset.setAssetCategory(assetCategory);
		service.saveRDAsset(theAsset);
		System.out.println("Asset id :" + 	theAsset.getAssetId());

        
		if(imageFile != null || !imageFile.isEmpty()) {
        	System.out.println("hello............");
        	String filePath 
            = servletContext.getRealPath("/") 
              + "resources"
              + File.separator + "images" + File.separator 
              + imageFile.getOriginalFilename(); 
        	try {
        		imageFile.transferTo(new File(filePath));
			} catch (IllegalStateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        	System.out.println(filePath);
        	RDAssetResource assetResource = new RDAssetResource();
        	assetResource.setAssetResourceFileName(imageFile.getOriginalFilename());
        	assetResource.setAssetResourceType("image");
        	assetResource.setAsset(theAsset);
        	
        	theAsset.getAssetResources().add(assetResource);
        }
        
		service.saveRDAsset(theAsset);
        return "redirect:/asset/list";
    }

    @GetMapping("/updateForm")
    public ModelAndView showFormForUpdate(@RequestParam("assetId") int theId,
        Model theModel) {
    	RDAsset asset = service.getRDAsset(theId);
        theModel.addAttribute("asset", asset);
        
        RDAssetForm assetForm = new RDAssetForm();
        assetForm.setAssetId(theId);
        assetForm.setAssetName(asset.getAssetName());
        assetForm.setAssetCategoryId(asset.getAssetCategory().getAssetCategoryId());
        List < RDAssetCategory > assetCategories = assetCategoryService.getRDAssetCategories();
		theModel.addAttribute("assetCategories", assetCategories);

		System.out.println("asset form - " + assetForm);
		
        theModel.addAttribute("assetForm", assetForm);
		
		ModelAndView modelAndView = new ModelAndView("asset-form");
		return modelAndView;
    }

    @GetMapping("/delete")
    public String deleteAsset(@RequestParam("assetId") int theId) {
        service.deleteRDAsset(theId);
        return "redirect:/asset/list";
    }
	
}
