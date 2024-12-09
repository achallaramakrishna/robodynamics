package com.robodynamics.service;

import com.robodynamics.model.RDFlashCardSet;
import com.robodynamics.model.RDMatchingGame;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

public interface RDMatchingGameService {

    RDMatchingGame getGameById(int gameId);

    List<RDMatchingGame> getAllGames();

    void saveGame(RDMatchingGame game);

	void deleteGame(int gameId);
	
	RDMatchingGame getGameByCourseSessionDetails(int courseSessionDetailId);
	
    Map<String, Object> processJson(MultipartFile jsonFile, Integer courseSessionDetailId);

	void saveImage(Map<String, Object> parsedData, String imageName, byte[] bytes);

	void saveGameWithCategoriesAndItems(Map<String, Object> parsedData, int courseSessionDetailId);

	Map<String, Object> parseJson(MultipartFile jsonFile) throws IOException;


}
