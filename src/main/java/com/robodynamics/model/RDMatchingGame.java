package com.robodynamics.model;

import java.util.List;
import java.util.Objects;
import javax.persistence.*;

@Entity
@Table(name = "rd_matching_games")
public class RDMatchingGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_id")
    private Long gameId;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<RDMatchingCategory> categories;

    public RDMatchingGame() {}

    public RDMatchingGame(Long gameId, String name, String description) {
        this.gameId = gameId;
        this.name = name;
        this.description = description;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<RDMatchingCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<RDMatchingCategory> categories) {
        this.categories = categories;
    }

    @Override
    public String toString() {
        return "RDMatchingGame [gameId=" + gameId + ", name=" + name + ", description=" + description + "]";
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RDMatchingGame)) return false;
        RDMatchingGame that = (RDMatchingGame) o;
        return Objects.equals(gameId, that.gameId) && Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(gameId, name);
    }
}
