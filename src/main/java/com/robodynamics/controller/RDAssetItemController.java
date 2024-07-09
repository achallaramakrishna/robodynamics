package com.robodynamics.controller;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
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

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.robodynamics.form.RDAssetForm;
import com.robodynamics.form.RDAssetItemForm;
import com.robodynamics.model.RDAsset;
import com.robodynamics.model.RDAssetCategory;
import com.robodynamics.model.RDAssetItem;
import com.robodynamics.model.RDAssetResource;
import com.robodynamics.service.RDAssetCategoryService;
import com.robodynamics.service.RDAssetItemService;
import com.robodynamics.service.RDAssetService;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@Controller
@RequestMapping("/assetitem")
public class RDAssetItemController {

	@Autowired
	ServletContext servletContext;

	@Autowired
	private RDAssetService assetService;

	@Autowired
	private RDAssetItemService assetItemService;

	@GetMapping("/list")
	public String listAssetItemss(Model theModel) {
		List<RDAssetItem> assetItems = assetItemService.getRDAssetItems();
		theModel.addAttribute("assetItems", assetItems);
		return "listAssetItems";
	}

	@GetMapping("/showForm")
	public ModelAndView home(Model theModel) {

		List<RDAsset> assets = assetService.getRDAssets();
		theModel.addAttribute("assets", assets);

		theModel.addAttribute("assetItemForm", new RDAssetItemForm());

		ModelAndView modelAndView = new ModelAndView("asset-item-upload");
		return modelAndView;
	}

	@PostMapping("/uploadSaveAssetItem")
	public String uploadSaveAssetItem(@ModelAttribute("assetItemForm") RDAssetItemForm assetItemForm,
			BindingResult result) {
		if (result.hasErrors()) {
			return "showForm";
		}

		System.out.println("asset id : " + assetItemForm.getAssetId());

		RDAsset asset = assetService.getRDAsset(assetItemForm.getAssetId());
		MultipartFile imageFile = assetItemForm.getImageFile();

		if (imageFile != null || !imageFile.isEmpty()) {
			System.out.println("hello............");
			String fileName = servletContext.getRealPath("/") + "resources\\images\\" + imageFile.getOriginalFilename();
			try {
				imageFile.transferTo(new File(fileName));
			} catch (IllegalStateException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			System.out.println(fileName);
			System.out.println("file uploaded");

			CSVReader reader = null;
			try {
				reader = new CSVReader(new FileReader(fileName));
			
			/* Variables to loop through the CSV File */
			String[] nextLine; /* for every line in the file */
			int lnNum = 0; /* line number */

				while ((nextLine = reader.readNext()) != null) {
					System.out.println(Arrays.toString(nextLine));
					RDAssetItem assetItem = new RDAssetItem();
					lnNum++;
					/* Bind CSV file input to table columns */
					assetItem.setAsset(asset);
					assetItem.setAssetNumPieces(Integer.parseInt(nextLine[0]));
					assetItem.setAssetItemName(nextLine[1]);

					assetItemService.saveRDAssetItem(assetItem);

				}
			} catch (FileNotFoundException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			} catch (CsvValidationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (NumberFormatException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return "redirect:/assetitem/list";
	}
}
