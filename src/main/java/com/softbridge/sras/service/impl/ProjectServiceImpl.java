package com.softbridge.sras.service.impl;

import com.softbridge.sras.exception.ResourceNotFoundException;
import com.softbridge.sras.model.Project;
import com.softbridge.sras.repository.ProjectRepository;
import com.softbridge.sras.service.ProjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Override
    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    @Override
    public Project updateProject(Long id, Project project) {
        Project existingProject = getProjectById(id);

        existingProject.setProjectName(project.getProjectName());
        existingProject.setClientName(project.getClientName());
        existingProject.setDescription(project.getDescription());
        existingProject.setStatus(project.getStatus());

        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(Long id) {
        Project existingProject = getProjectById(id);
        projectRepository.delete(existingProject);
    }
}