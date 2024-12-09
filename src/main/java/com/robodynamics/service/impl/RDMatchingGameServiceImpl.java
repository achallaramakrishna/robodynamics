package com.robodynamics.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.robodynamics.dao.RDMatchingGameDao;
import com.robodynamics.model.RDCourseSessionDetail;
import com.robodynamics.model.RDMatchingCategory;
import com.robodynamics.model.RDMatchingGame;
import com.robodynamics.model.RDMatchingItem;
import com.robodynamics.service.RDCourseSessionDetailService;
import com.robodynamics.service.RDMatchingCategoryService;
import com.robodynamics.service.RDMatchingGameService;
import com.robodynamics.service.RDMatchingItemService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RDMatchingGameServiceImpl implements RDMatchingGameService {

    @Autowired
    private RDMatchingGameDao matchingGameDao;
    
    @Autowired
    private RDMatchingCategoryService matchingCategoryService;
    
    @Autowired
    private RDMatchingItemService matchingItemService;
    
    
    
    
    @Autowired
    private RDCourseSessionDetailService courseSessionDetailService;

    @Override
    @Transactional(readOnly = true)
    public RDMatchingGame getGameById(int gameId) {
        return matchingGameDao.getGameById(gameId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RDMatchingGame> getAllGames() {
        return matchingGameDao.getAllGames();
    }

    @Override
    @Transactional
    public void saveGame(RDMatchingGame game) {
        matchingGameDao.saveGame(game);
    }

	@Override
	@Transactional
	public void deleteGame(int gameId) {
		matchingGameDao.deleteGame(gameId);
		
	}

	@Override
	@Transactional
	public RDMatchingGame getGameByCourseSessionDetails(int courseSessionDetailId) {
		
		return matchingGameDao.getGameByCourseSessionDetails(courseSessionDetailId);
	}


	@Override
    public Map<String, Object> processJson(MultipartFile jsonFile, Integer courseSessionDetailId) {
        Map<String, Object> parsedData = new HashMap<>();

        try {
            // Parse JSON
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> jsonData = objectMapper.readValue(jsonFile.getInputStream(), Map.class);

            // Extract game information
            RDMatchingGame game = new RDMatchingGame();
            game.setName((String) jsonData.get("gameName"));
            game.setDescription((String) jsonData.get("description"));
            
            RDCourseSessionDetail courseSessionDetail =
            		courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
            game.setCourseSessionDetail(courseSessionDetail);
            this.saveGame(game);

            // Extract categories
            List<Map<String, Object>> categories = (List<Map<String, Object>>) jsonData.get("categories");
            List<RDMatchingCategory> savedCategories = new ArrayList<>();
            for (Map<String, Object> categoryData : categories) {
                RDMatchingCategory category = new RDMatchingCategory();
                
                
                category.setGame(game);
                category.setCategoryName((String) categoryData.get("categoryName"));
                category.setImageName((String) categoryData.get("imageName"));
                matchingCategoryService.saveCategory(category);
                savedCategories.add(category);

                // Extract items for the category
                List<Map<String, Object>> items = (List<Map<String, Object>>) categoryData.get("items");
                for (Map<String, Object> itemData : items) {
                    RDMatchingItem item = new RDMatchingItem();
                    item.setItemName((String) itemData.get("itemName"));
                    item.setMatchingText((String) itemData.get("matchingText"));
                    item.setImageName((String) itemData.get("imageName"));
                    item.setCategory(category);
                    matchingItemService.saveItem(item);
                }
            }

            // Store saved categories and their associated items in parsedData
            parsedData.put("game", game);
            parsedData.put("categories", savedCategories);

        } catch (Exception e) {
            throw new RuntimeException("Error processing JSON file", e);
        }

        return parsedData;
    }

	@Override
	@Transactional
	public void saveImage(Map<String, Object> parsedData, String imageName, byte[] imageBytes) {
	    try {
	        // Define the directory to save images
	        Path imagePath = Paths.get("src/main/resources/assets/images", imageName);

	        // Ensure the directory exists
	        if (!Files.exists(imagePath.getParent())) {
	            Files.createDirectories(imagePath.getParent());
	        }

	        // Write the image file to the directory
	        Files.write(imagePath, imageBytes);
	    } catch (Exception e) {
	        throw new RuntimeException("Error saving image: " + imageName, e);
	    }
	}

	public Map<String, Object> parseJson(MultipartFile jsonFile) throws IOException {
	    ObjectMapper objectMapper = new ObjectMapper();
	    return objectMapper.readValue(jsonFile.getInputStream(), new TypeReference<>() {});
	}

	public void saveGameWithCategoriesAndItems(Map<String, Object> parsedData, int courseSessionDetailId) {
	    // Extract data from parsed JSON
	    String gameName = (String) parsedData.get("name");
	    String description = (String) parsedData.get("description");
	    List<Map<String, Object>> categories = (List<Map<String, Object>>) parsedData.get("categories");

	    // Create and save the game
	    RDMatchingGame game = new RDMatchingGame();
	    game.setName(gameName);
	    game.setDescription(description);
	    RDCourseSessionDetail sessionDetail = courseSessionDetailService.getRDCourseSessionDetail(courseSessionDetailId);
	    game.setCourseSessionDetail(sessionDetail);
	    this.saveGame(game);

	    // Create and save categories and items
	    for (Map<String, Object> categoryData : categories) {
	        RDMatchingCategory category = new RDMatchingCategory();
	        category.setGame(game);
	        category.setCategoryName((String) categoryData.get("categoryName"));
	        category.setImageName((String) categoryData.get("imageName"));
	        matchingCategoryService.saveCategory(category);

	        List<Map<String, Object>> items = (List<Map<String, Object>>) categoryData.get("items");
	        for (Map<String, Object> itemData : items) {
	            RDMatchingItem item = new RDMatchingItem();
	            item.setCategory(category);
	            item.setItemName((String) itemData.get("itemName"));
	            item.setMatchingText((String) itemData.get("matchingText"));
	            item.setImageName((String) itemData.get("imageName"));
	            matchingItemService.saveItem(item);
	        }
	    }
	}


}
