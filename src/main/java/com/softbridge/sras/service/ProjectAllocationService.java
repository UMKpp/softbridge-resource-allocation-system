package com.softbridge.sras.service;

import com.softbridge.sras.dto.ProjectAllocationResponse;
import com.softbridge.sras.model.ProjectAllocation;

import java.util.List;

public interface ProjectAllocationService {

    ProjectAllocation allocateEmployee(ProjectAllocation allocation);

    List<ProjectAllocationResponse> getAllAllocations();

    List<ProjectAllocationResponse> getTeamByProjectId(Long projectId);

    void removeAllocation(Long id);
}