package com.softbridge.sras.service;

import com.softbridge.sras.model.Project;

import java.util.List;

public interface ProjectService {

    Project createProject(Project project);

    List<Project> getAllProjects();

    List<Project> getProjectsByProjectManager(String projectManagerId);

    Project getProjectById(Long id);

    Project assignProjectManager(Long id, String projectManagerId);

    Project updateProject(Long id, Project project);

    void deleteProject(Long id);
}
