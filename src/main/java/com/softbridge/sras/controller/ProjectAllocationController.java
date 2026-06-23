package com.softbridge.sras.controller;

import com.softbridge.sras.model.ProjectAllocation;
import com.softbridge.sras.service.ProjectAllocationService;
import org.springframework.web.bind.annotation.*;
import com.softbridge.sras.dto.ProjectAllocationResponse;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/allocations")
public class ProjectAllocationController {

    private final ProjectAllocationService allocationService;

    public ProjectAllocationController(ProjectAllocationService allocationService) {
        this.allocationService = allocationService;
    }

    @PostMapping
    public ProjectAllocation allocateEmployee(
            @Valid @RequestBody ProjectAllocation allocation) {
        return allocationService.allocateEmployee(allocation);
    }

    @GetMapping
    public List<ProjectAllocationResponse> getAllAllocations() {
        return allocationService.getAllAllocations();
    }

    @GetMapping("/project/{projectId}")
    public List<ProjectAllocationResponse> getTeamByProject(@PathVariable Long projectId) {
        return allocationService.getTeamByProjectId(projectId);
    }

    @DeleteMapping("/{id}")
    public void removeAllocation(@PathVariable Long id) {
        allocationService.removeAllocation(id);
    }
}