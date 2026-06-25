package com.softbridge.sras.service;

import com.softbridge.sras.dto.EmployeeProjectAssignmentResponse;
import com.softbridge.sras.dto.ProjectTeamChangeRequest;
import com.softbridge.sras.model.Employee;

import java.util.List;

public interface EmployeeProjectAssignmentService {

    EmployeeProjectAssignmentResponse assignEmployee(Long projectId, String employeeId, String role, String skillName, Integer skillLevel, Employee actor, boolean allowOverride);

    List<EmployeeProjectAssignmentResponse> getProjectTeam(Long projectId, Employee actor, boolean hrAccess);

    List<EmployeeProjectAssignmentResponse> getEmployeeProjects(String employeeId);

    void completeProject(Long projectId, Employee actor);

    EmployeeProjectAssignmentResponse changeTeam(Long projectId, ProjectTeamChangeRequest request, Employee actor);

    void removeAssignment(Long projectId, Long assignmentId, Employee actor, boolean hrAccess);
}
