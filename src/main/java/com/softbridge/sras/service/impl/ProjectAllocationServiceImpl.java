package com.softbridge.sras.service.impl;

import com.softbridge.sras.exception.ResourceNotFoundException;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.EmployeeSkill;
import com.softbridge.sras.model.Project;
import com.softbridge.sras.model.ProjectAllocation;
import com.softbridge.sras.repository.EmployeeRepository;
import com.softbridge.sras.repository.EmployeeSkillRepository;
import com.softbridge.sras.repository.ProjectAllocationRepository;
import com.softbridge.sras.repository.ProjectRepository;
import com.softbridge.sras.service.ProjectAllocationService;
import org.springframework.stereotype.Service;
import com.softbridge.sras.dto.ProjectAllocationResponse;

import java.time.LocalDate;
import java.util.List;

@Service
public class ProjectAllocationServiceImpl implements ProjectAllocationService {

    private final ProjectAllocationRepository allocationRepository;
    private final ProjectRepository projectRepository;
    private final EmployeeRepository employeeRepository;
    private final EmployeeSkillRepository employeeSkillRepository;

    public ProjectAllocationServiceImpl(ProjectAllocationRepository allocationRepository,
                                        ProjectRepository projectRepository,
                                        EmployeeRepository employeeRepository,
                                        EmployeeSkillRepository employeeSkillRepository) {
        this.allocationRepository = allocationRepository;
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
        this.employeeSkillRepository = employeeSkillRepository;
    }

    @Override
    public ProjectAllocation allocateEmployee(ProjectAllocation allocation) {

        if (allocation.getProject() == null) {
            throw new IllegalArgumentException("Project is required");
        }

        if (allocation.getEmployee() == null) {
            throw new IllegalArgumentException("Employee is required");
        }

        if (allocation.getProject().getProjectId() == null) {
            throw new IllegalArgumentException("Project ID is required");
        }

        if (allocation.getEmployee().getEmployeeId() == null) {
            throw new IllegalArgumentException("Employee ID is required");
        }

        ProjectAllocationResponse response = assignEmployeeToProject(
                allocation.getProject().getProjectId(),
                allocation.getEmployee().getEmployeeId(),
                allocation.getAllocatedRole(),
                true
        );

        return allocationRepository.findById(response.getAllocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with id: " + response.getAllocationId()));
    }

    @Override
    public ProjectAllocationResponse assignEmployeeToProject(Long projectId,
                                                             String employeeId,
                                                             String allocatedRole,
                                                             boolean allowOverride) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        if (allocationRepository.existsByProjectAndEmployee(project, employee)) {
            throw new IllegalArgumentException("Employee is already allocated to this project");
        }

        validateSkillRequirement(project, employee, allowOverride);

        ProjectAllocation allocation = new ProjectAllocation();
        allocation.setProject(project);
        allocation.setEmployee(employee);
        allocation.setAllocatedRole(resolveAllocatedRole(allocatedRole, employee));
        allocation.setAllocationDate(LocalDate.now());

        return mapToResponse(allocationRepository.save(allocation));
    }

    public List<ProjectAllocationResponse> getAllAllocations() {
        return allocationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ProjectAllocationResponse> getTeamByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        return allocationRepository.findByProject(project)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ProjectAllocationResponse> getAllocationsByEmployeeId(String employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        return allocationRepository.findByEmployee(employee)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public void removeAllocation(Long id) {
        ProjectAllocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with id: " + id));

        allocationRepository.delete(allocation);
    }

    private ProjectAllocationResponse mapToResponse(ProjectAllocation allocation) {
        return new ProjectAllocationResponse(
                allocation.getAllocationId(),
                allocation.getProject().getProjectId(),
                allocation.getEmployee().getEmployeeId(),
                allocation.getEmployee().getFullName(),
                allocation.getProject().getProjectName(),
                allocation.getProject().getClientName(),
                allocation.getAllocatedRole(),
                allocation.getProject().getRequiredSkillName(),
                allocation.getProject().getRequiredSkillLevel(),
                allocation.getAllocationDate()
        );
    }

    private void validateSkillRequirement(Project project, Employee employee, boolean allowOverride) {
        if (project.getRequiredSkillName() == null || project.getRequiredSkillName().isBlank()) {
            return;
        }

        int requiredLevel = project.getRequiredSkillLevel() == null ? 1 : project.getRequiredSkillLevel();

        boolean hasRequiredSkill = employeeSkillRepository
                .findByEmployeeAndSkillSkillNameIgnoreCase(employee, project.getRequiredSkillName())
                .map(EmployeeSkill::getSkillLevel)
                .filter(level -> level >= requiredLevel)
                .isPresent();

        if (!hasRequiredSkill && !allowOverride) {
            throw new IllegalArgumentException("Employee does not meet the required skill level for this project");
        }
    }

    private String resolveAllocatedRole(String allocatedRole, Employee employee) {
        if (allocatedRole == null || allocatedRole.isBlank()) {
            return employee.getJobRole();
        }

        return allocatedRole.trim();
    }
}
