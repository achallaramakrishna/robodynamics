package com.robodynamics.wrapper;

import java.util.List;

import com.robodynamics.model.RDProject;

public class ProjectGroup<T> {
    private String groupDisplayName;
    private List<T> items;

    public ProjectGroup(String groupDisplayName, List<T> items) {
        this.groupDisplayName = groupDisplayName;
        this.items = items;
    }

    

	public String getGroupDisplayName() {
        return groupDisplayName;
    }

    public List<T> getItems() {
        return items;
    }
}

