package com.softbridge.sras.service.impl;

import com.softbridge.sras.exception.ResourceNotFoundException;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.Project;
import com.softbridge.sras.repository.EmployeeRepository;
import com.softbridge.sras.repository.ProjectRepository;
import com.softbridge.sras.service.ProjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              EmployeeRepository employeeRepository) {
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public Project createProject(Project project) {
        normalizeRequiredSkill(project);
        return projectRepository.save(project);
    }

    @Override
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public List<Project> getProjectsByProjectManager(String projectManagerId) {
        Employee projectManager = employeeRepository.findById(projectManagerId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + projectManagerId));

        return projectRepository.findByProjectManager(projectManager);
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    @Override
    public Project assignProjectManager(Long id, String projectManagerId) {
        Project project = getProjectById(id);
        Employee projectManager = employeeRepository.findById(projectManagerId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + projectManagerId));

        if (!"PM".equals(projectManager.getUserType())) {
            throw new IllegalArgumentException("Assigned project manager must have PM role");
        }

        project.setProjectManager(projectManager);

        return projectRepository.save(project);
    }

    @Override
    public Project updateProject(Long id, Project project) {
        Project existingProject = getProjectById(id);

        existingProject.setProjectName(project.getProjectName());
        existingProject.setClientName(project.getClientName());
        existingProject.setDescription(project.getDescription());
        existingProject.setStatus(project.getStatus());
        existingProject.setRequiredSkillName(project.getRequiredSkillName());
        existingProject.setRequiredSkillLevel(project.getRequiredSkillLevel());
        normalizeRequiredSkill(existingProject);

        return projectRepository.save(existingProject);
    }

    @Override
    public void deleteProject(Long id) {
        Project existingProject = getProjectById(id);
        projectRepository.delete(existingProject);
    }

    private void normalizeRequiredSkill(Project project) {
        if (project.getRequiredSkillName() != null) {
            String requiredSkillName = project.getRequiredSkillName().trim();
            project.setRequiredSkillName(requiredSkillName.isBlank() ? null : requiredSkillName);
        }

        if (project.getRequiredSkillName() != null && project.getRequiredSkillLevel() == null) {
            project.setRequiredSkillLevel(1);
        }
    }
}
