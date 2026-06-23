package com.softbridge.sras.service;

import com.softbridge.sras.model.Project;

import java.util.List;

public interface ProjectService {

    Project createProject(Project project);

    List<Project> getAllProjects();

    Project getProjectById(Long id);

    Project updateProject(Long id, Project project);

    void deleteProject(Long id);
}