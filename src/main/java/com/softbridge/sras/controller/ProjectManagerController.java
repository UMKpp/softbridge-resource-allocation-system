package com.softbridge.sras.controller;

import com.softbridge.sras.dto.ProjectManagerAvailabilityResponse;
import com.softbridge.sras.service.ProjectService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProjectManagerController {

    private final ProjectService projectService;

    public ProjectManagerController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/pms")
    public List<ProjectManagerAvailabilityResponse> getProjectManagers() {
        return projectService.getProjectManagers();
    }
}
