package com.softbridge.sras.service;

import com.softbridge.sras.model.Project;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.dto.ProjectManagerAvailabilityResponse;

import java.util.List;

public interface ProjectService {

    Project createProject(Project project);

    List<Project> getAllProjects();

    List<Project> getProjectsByProjectManager(String projectManagerId);

    List<ProjectManagerAvailabilityResponse> getProjectManagers();

    Project getProjectById(Long id);

    Project assignProjectManager(Long id, String projectManagerId);

    Project assignProjectManagerByUsername(Long id, String username);

    Project updateProject(Long id, Project project);

    Project updateProjectStatus(Long id, String status, Employee actor);

    void deleteProject(Long id);
}
