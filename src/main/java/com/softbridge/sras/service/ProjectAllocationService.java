package com.softbridge.sras.service;

import com.softbridge.sras.dto.ProjectAllocationResponse;
import com.softbridge.sras.model.ProjectAllocation;

import java.util.List;

public interface ProjectAllocationService {

    ProjectAllocation allocateEmployee(ProjectAllocation allocation);

    ProjectAllocationResponse assignEmployeeToProject(Long projectId, String employeeId, String allocatedRole, boolean allowOverride);

    List<ProjectAllocationResponse> getAllAllocations();

    List<ProjectAllocationResponse> getTeamByProjectId(Long projectId);

    List<ProjectAllocationResponse> getAllocationsByEmployeeId(String employeeId);

    void removeAllocation(Long id);
}
