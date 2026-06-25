package com.softbridge.sras.service.impl;

import com.softbridge.sras.exception.ResourceNotFoundException;
import com.softbridge.sras.dto.ProjectManagerAvailabilityResponse;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.Project;
import com.softbridge.sras.repository.EmployeeProjectAssignmentRepository;
import com.softbridge.sras.repository.EmployeeRepository;
import com.softbridge.sras.repository.ProjectAllocationRepository;
import com.softbridge.sras.repository.ProjectRepository;
import com.softbridge.sras.service.ProjectService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private static final Set<String> PROJECT_STATUSES = Set.of("PLANNING", "ACTIVE", "COMPLETED");

    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeProjectAssignmentRepository assignmentRepository;
    private final ProjectAllocationRepository allocationRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              EmployeeRepository employeeRepository,
                              EmployeeProjectAssignmentRepository assignmentRepository,
                              ProjectAllocationRepository allocationRepository) {
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
        this.assignmentRepository = assignmentRepository;
        this.allocationRepository = allocationRepository;
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
    public List<ProjectManagerAvailabilityResponse> getProjectManagers() {
        return employeeRepository.findByUserType("PM")
                .stream()
                .map(projectManager -> new ProjectManagerAvailabilityResponse(
                        projectManager.getEmployeeId(),
                        projectManager.getUsername(),
                        projectRepository.existsByProjectManager(projectManager) ? "UNAVAILABLE" : "AVAILABLE"
                ))
                .toList();
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

        return assignProjectManager(project, projectManager);
    }

    @Override
    public Project assignProjectManagerByUsername(Long id, String username) {
        Project project = getProjectById(id);
        String lookup = username == null ? "" : username.trim();

        Employee projectManager = employeeRepository.findByUsernameIgnoreCase(lookup)
                .or(() -> employeeRepository.findByEmployeeIdIgnoreCase(lookup))
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with username: " + username));

        return assignProjectManager(project, projectManager);
    }

    private Project assignProjectManager(Project project, Employee projectManager) {
        if (!"PM".equals(projectManager.getUserType())) {
            projectManager.setUserType("PM");
            projectManager.setJobRole("Project Manager");
            employeeRepository.save(projectManager);
        }

        boolean assignedToAnotherProject = projectRepository.findByProjectManager(projectManager)
                .stream()
                .anyMatch(existingProject -> !existingProject.getProjectId().equals(project.getProjectId()));

        if (assignedToAnotherProject) {
            throw new IllegalArgumentException("Project manager is unavailable");
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
    public Project updateProjectStatus(Long id, String status, Employee actor) {
        Project project = getProjectById(id);

        if (project.getProjectManager() == null || !project.getProjectManager().getEmployeeId().equals(actor.getEmployeeId())) {
            throw new AccessDeniedException("Project is not assigned to this project manager");
        }

        String normalizedStatus = status == null ? "" : status.trim().toUpperCase();

        if (!PROJECT_STATUSES.contains(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid project status");
        }

        project.setStatus(normalizedStatus);

        return projectRepository.save(project);
    }

    @Override
    @Transactional
    public void deleteProject(Long id) {
        Project existingProject = getProjectById(id);
        assignmentRepository.deleteAll(assignmentRepository.findByProject(existingProject));
        allocationRepository.deleteAll(allocationRepository.findByProject(existingProject));
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
