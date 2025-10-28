package com.robodynamics.dto;

public class MentorDTO {
    private Integer id;
    private String name;
    public MentorDTO() {}
    public MentorDTO(Integer id, String name) { this.id = id; this.name = name; }
    public Integer getId() { return id; }
    public String getName() { return name; }
    public void setId(Integer id) { this.id = id; }
    public void setName(String name) { this.name = name; }
}
