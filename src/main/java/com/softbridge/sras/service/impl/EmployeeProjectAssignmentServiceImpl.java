package com.softbridge.sras.service.impl;

import com.softbridge.sras.dto.EmployeeProjectAssignmentResponse;
import com.softbridge.sras.dto.ProjectTeamChangeRequest;
import com.softbridge.sras.exception.ResourceNotFoundException;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.EmployeeProjectAssignment;
import com.softbridge.sras.model.EmployeeSkill;
import com.softbridge.sras.model.Project;
import com.softbridge.sras.repository.EmployeeProjectAssignmentRepository;
import com.softbridge.sras.repository.EmployeeRepository;
import com.softbridge.sras.repository.EmployeeSkillRepository;
import com.softbridge.sras.repository.ProjectRepository;
import com.softbridge.sras.service.EmployeeProjectAssignmentService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class EmployeeProjectAssignmentServiceImpl implements EmployeeProjectAssignmentService {

    private static final String ACTIVE = "ACTIVE";
    private static final String COMPLETED = "COMPLETED";
    private static final Map<String, List<String>> ROLE_SKILLS = Map.of(
            "BACKEND", List.of("Java", "Spring Boot"),
            "BACKEND DEVELOPER", List.of("Java", "Spring Boot"),
            "FRONTEND", List.of("React", "React Native"),
            "FRONTEND DEVELOPER", List.of("React", "React Native"),
            "QA", List.of("QA Testing", "Mobile App Testing"),
            "QA ENGINEER", List.of("QA Testing", "Mobile App Testing")
    );

    private final EmployeeProjectAssignmentRepository assignmentRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeSkillRepository employeeSkillRepository;

    public EmployeeProjectAssignmentServiceImpl(EmployeeProjectAssignmentRepository assignmentRepository,
                                                ProjectRepository projectRepository,
                                                EmployeeRepository employeeRepository,
                                                EmployeeSkillRepository employeeSkillRepository) {
        this.assignmentRepository = assignmentRepository;
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
        this.employeeSkillRepository = employeeSkillRepository;
    }

    @Override
    public EmployeeProjectAssignmentResponse assignEmployee(Long projectId,
                                                            String employeeId,
                                                            String role,
                                                            String skillName,
                                                            Integer skillLevel,
                                                            Employee actor,
                                                            boolean allowOverride) {
        Project project = getProject(projectId);
        Employee employee = getEmployee(employeeId);
        requireProjectManager(project, actor, allowOverride);

        if (assignmentRepository.existsByProjectAndEmployeeAndStatus(project, employee, ACTIVE)) {
            throw new IllegalArgumentException("Employee already has an active assignment for this project");
        }

        validateSkill(role, skillName, skillLevel, employee, allowOverride);

        EmployeeProjectAssignment assignment = new EmployeeProjectAssignment();
        assignment.setProject(project);
        assignment.setEmployee(employee);
        assignment.setRole(normalizeRoleName(role));
        assignment.setAssignedBy(actor);
        assignment.setStatus(ACTIVE);

        return mapToResponse(assignmentRepository.save(assignment));
    }

    @Override
    public List<EmployeeProjectAssignmentResponse> getProjectTeam(Long projectId, Employee actor, boolean hrAccess) {
        Project project = getProject(projectId);
        requireProjectManager(project, actor, hrAccess);

        return assignmentRepository.findByProject(project)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<EmployeeProjectAssignmentResponse> getEmployeeProjects(String employeeId) {
        Employee employee = getEmployee(employeeId);

        return assignmentRepository.findByEmployee(employee)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void completeProject(Long projectId, Employee actor) {
        Project project = getProject(projectId);
        requireProjectManager(project, actor, false);

        project.setStatus(COMPLETED);
        projectRepository.save(project);

        assignmentRepository.findByProject(project).forEach(assignment -> {
            assignment.setStatus(COMPLETED);
            assignmentRepository.save(assignment);
        });
    }

    @Override
    public EmployeeProjectAssignmentResponse changeTeam(Long projectId, ProjectTeamChangeRequest request, Employee actor) {
        Project project = getProject(projectId);
        requireProjectManager(project, actor, false);

        EmployeeProjectAssignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + request.getAssignmentId()));

        if (!assignment.getProject().getProjectId().equals(project.getProjectId())) {
            throw new AccessDeniedException("Assignment does not belong to this project");
        }

        if (request.getEmployeeId() != null && !request.getEmployeeId().isBlank()) {
            Employee employee = getEmployee(request.getEmployeeId());
            validateSkill(request.getRole(), null, null, employee, false);
            assignment.setEmployee(employee);
        }

        if (request.getRole() != null && !request.getRole().isBlank()) {
            validateSkill(request.getRole(), null, null, assignment.getEmployee(), false);
            assignment.setRole(normalizeRoleName(request.getRole()));
        }

        assignment.setAssignedBy(actor);

        return mapToResponse(assignmentRepository.save(assignment));
    }

    @Override
    public void removeAssignment(Long projectId, Long assignmentId, Employee actor, boolean hrAccess) {
        Project project = getProject(projectId);
        requireProjectManager(project, actor, hrAccess);

        EmployeeProjectAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        if (!assignment.getProject().getProjectId().equals(project.getProjectId())) {
            throw new AccessDeniedException("Assignment does not belong to this project");
        }

        assignmentRepository.delete(assignment);
    }

    private Project getProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
    }

    private Employee getEmployee(String employeeLookup) {
        String lookup = employeeLookup == null ? "" : employeeLookup.trim();

        return employeeRepository.findByEmployeeIdIgnoreCase(lookup)
                .or(() -> employeeRepository.findByUsernameIgnoreCase(lookup))
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with username or id: " + employeeLookup));
    }

    private void requireProjectManager(Project project, Employee actor, boolean hrAccess) {
        if (hrAccess) {
            return;
        }

        if (project.getProjectManager() == null || !project.getProjectManager().getEmployeeId().equals(actor.getEmployeeId())) {
            throw new AccessDeniedException("Project is not assigned to this project manager");
        }
    }

    private void validateSkill(String role, String skillName, Integer skillLevel, Employee employee, boolean allowOverride) {
        if (allowOverride) {
            return;
        }

        int requiredLevel = skillLevel == null ? 1 : skillLevel;
        List<String> requiredSkills = skillName == null || skillName.isBlank()
                ? ROLE_SKILLS.getOrDefault(normalizeRoleName(role).toUpperCase(), List.of(normalizeRoleName(role)))
                : List.of(skillName.trim());

        boolean qualified = requiredSkills.stream()
                .anyMatch(requiredSkill -> employeeSkillRepository
                        .findByEmployeeAndSkillSkillNameIgnoreCase(employee, requiredSkill)
                        .map(EmployeeSkill::getSkillLevel)
                        .filter(level -> level >= requiredLevel)
                        .isPresent());

        if (!qualified) {
            throw new IllegalArgumentException("Employee does not meet the required skill level for this project role");
        }
    }

    private String normalizeRoleName(String role) {
        if (role == null || role.isBlank()) {
            throw new IllegalArgumentException("Project role is required");
        }

        return role.trim();
    }

    private EmployeeProjectAssignmentResponse mapToResponse(EmployeeProjectAssignment assignment) {
        return new EmployeeProjectAssignmentResponse(
                assignment.getId(),
                assignment.getProject().getProjectId(),
                assignment.getProject().getProjectName(),
                assignment.getEmployee().getEmployeeId(),
                assignment.getEmployee().getFullName(),
                assignment.getEmployee().getUsername(),
                assignment.getRole(),
                assignment.getAssignedBy().getFullName(),
                assignment.getProject().getStatus()
        );
    }
}
