package com.softbridge.sras.controller;

import com.softbridge.sras.dto.EmployeeProjectAssignmentResponse;
import com.softbridge.sras.dto.ProjectAssignmentRequest;
import com.softbridge.sras.dto.ProjectTeamChangeRequest;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.Project;
import com.softbridge.sras.security.RoleService;
import com.softbridge.sras.service.EmployeeProjectAssignmentService;
import com.softbridge.sras.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final EmployeeProjectAssignmentService assignmentService;
    private final RoleService roleService;

    public ProjectController(ProjectService projectService,
                             EmployeeProjectAssignmentService assignmentService,
                             RoleService roleService) {
        this.projectService = projectService;
        this.assignmentService = assignmentService;
        this.roleService = roleService;
    }

    @PostMapping
    public Project createProject(@Valid @RequestBody Project project) {
        return projectService.createProject(project);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/my")
    public List<Project> getMyProjects(Authentication authentication) {
        return projectService.getProjectsByProjectManager(
                roleService.getCurrentEmployee(authentication).getEmployeeId()
        );
    }

    @GetMapping("/employee")
    public List<EmployeeProjectAssignmentResponse> getEmployeeProjects(Authentication authentication) {
        return assignmentService.getEmployeeProjects(
                roleService.getCurrentEmployee(authentication).getEmployeeId()
        );
    }

    @PutMapping("/{id}/pm/{pmId}")
    public Project assignProjectManager(@PathVariable Long id, @PathVariable String pmId) {
        return projectService.assignProjectManager(id, pmId);
    }

    @PutMapping("/{id}/pm")
    public Project assignProjectManagerByUsername(@PathVariable Long id, @RequestParam String username) {
        return projectService.assignProjectManagerByUsername(id, username);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @Valid @RequestBody Project project) {
        return projectService.updateProject(id, project);
    }

    @PutMapping("/{id}/status")
    public Project updateProjectStatus(@PathVariable Long id,
                                       @RequestParam String status,
                                       Authentication authentication) {
        return projectService.updateProjectStatus(
                id,
                status,
                roleService.getCurrentEmployee(authentication)
        );
    }

    @PutMapping("/my/{id}/status")
    public Project updateMyProjectStatus(@PathVariable Long id,
                                         @RequestParam String status,
                                         Authentication authentication) {
        return projectService.updateProjectStatus(
                id,
                status,
                roleService.getCurrentEmployee(authentication)
        );
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @PostMapping("/{projectId}/assign/{employeeId}")
    public EmployeeProjectAssignmentResponse assignEmployeeToProject(@PathVariable Long projectId,
                                                                     @PathVariable String employeeId,
                                                                     @RequestBody ProjectAssignmentRequest request,
                                                                     Authentication authentication) {
        Employee actor = roleService.getCurrentEmployee(authentication);
        boolean hrAccess = roleService.hasRole(authentication, "HR");

        return assignmentService.assignEmployee(
                projectId,
                employeeId,
                request.getAssignmentRole(),
                request.getSkillName(),
                request.getSkillLevel(),
                actor,
                hrAccess
        );
    }

    @GetMapping("/{projectId}/team")
    public List<EmployeeProjectAssignmentResponse> getProjectTeam(@PathVariable Long projectId,
                                                                  Authentication authentication) {
        return assignmentService.getProjectTeam(
                projectId,
                roleService.getCurrentEmployee(authentication),
                roleService.hasRole(authentication, "HR")
        );
    }

    @PutMapping("/{projectId}/complete")
    public void completeProject(@PathVariable Long projectId, Authentication authentication) {
        assignmentService.completeProject(projectId, roleService.getCurrentEmployee(authentication));
    }

    @PutMapping("/{projectId}/change-team")
    public EmployeeProjectAssignmentResponse changeProjectTeam(@PathVariable Long projectId,
                                                               @RequestBody ProjectTeamChangeRequest request,
                                                               Authentication authentication) {
        return assignmentService.changeTeam(projectId, request, roleService.getCurrentEmployee(authentication));
    }

    @DeleteMapping("/{projectId}/team/{assignmentId}")
    public void removeProjectTeamMember(@PathVariable Long projectId,
                                        @PathVariable Long assignmentId,
                                        Authentication authentication) {
        assignmentService.removeAssignment(
                projectId,
                assignmentId,
                roleService.getCurrentEmployee(authentication),
                roleService.hasRole(authentication, "HR")
        );
    }

    @DeleteMapping("/my/{projectId}/team/{assignmentId}")
    public void removeMyProjectTeamMember(@PathVariable Long projectId,
                                          @PathVariable Long assignmentId,
                                          Authentication authentication) {
        assignmentService.removeAssignment(
                projectId,
                assignmentId,
                roleService.getCurrentEmployee(authentication),
                false
        );
    }
}
