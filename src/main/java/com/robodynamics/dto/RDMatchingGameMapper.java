package com.robodynamics.dto;

import java.util.stream.Collectors;

import com.robodynamics.model.*;

public class RDMatchingGameMapper {

    public static RDMatchingGameDTO toDTO(
            RDMatchingGame game,
            java.util.List<RDMatchingCategory> categories,
            java.util.Map<Integer, java.util.List<RDMatchingItem>> itemsByCategory) {

        RDMatchingGameDTO dto = new RDMatchingGameDTO();
        dto.setGameId(game.getGameId());
        dto.setName(game.getName());
        dto.setDescription(game.getDescription());

        dto.setCategories(
            categories.stream().map(c -> {
                RDMatchingCategoryDTO cdto = new RDMatchingCategoryDTO();
                cdto.setCategoryId(c.getCategoryId());
                cdto.setCategoryName(c.getCategoryName());
                cdto.setImageName(c.getImageName());

                cdto.setItems(
                    itemsByCategory.getOrDefault(c.getCategoryId(), java.util.List.of())
                        .stream()
                        .map(i -> {
                            RDMatchingItemDTO idto = new RDMatchingItemDTO();
                            idto.setItemId(i.getItemId());
                            idto.setItemName(i.getItemName());
                            idto.setMatchingText(i.getMatchingText());
                            idto.setImageName(i.getImageName());
                            return idto;
                        })
                        .collect(Collectors.toList())
                );

                return cdto;
            }).collect(Collectors.toList())
        );

        return dto;
    }
}
