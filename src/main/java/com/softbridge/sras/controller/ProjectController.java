package com.softbridge.sras.controller;

import com.softbridge.sras.model.Project;
import com.softbridge.sras.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.softbridge.sras.service.ProjectAllocationService;
import com.softbridge.sras.dto.ProjectAllocationResponse;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService,
                             ProjectAllocationService projectAllocationService) {
        this.projectService = projectService;
        this.projectAllocationService = projectAllocationService;
    }

    @PostMapping
    public Project createProject(@Valid @RequestBody Project project) {
        return projectService.createProject(project);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @Valid @RequestBody Project project) {
        return projectService.updateProject(id, project);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    private final ProjectAllocationService projectAllocationService;

    @GetMapping("/{projectId}/team")
    public List<ProjectAllocationResponse> getProjectTeam(@PathVariable Long projectId) {
        return projectAllocationService.getTeamByProjectId(projectId);
    }
}