package com.softbridge.sras.service.impl;

import com.softbridge.sras.exception.ResourceNotFoundException;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.Project;
import com.softbridge.sras.model.ProjectAllocation;
import com.softbridge.sras.repository.EmployeeRepository;
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

    public ProjectAllocationServiceImpl(ProjectAllocationRepository allocationRepository,
                                        ProjectRepository projectRepository,
                                        EmployeeRepository employeeRepository) {
        this.allocationRepository = allocationRepository;
        this.projectRepository = projectRepository;
        this.employeeRepository = employeeRepository;
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

        Long projectId = allocation.getProject().getProjectId();
        String employeeId = allocation.getEmployee().getEmployeeId();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        boolean alreadyAllocated = allocationRepository.existsByProjectAndEmployee(project, employee);

        if (alreadyAllocated) {
            throw new IllegalArgumentException("Employee is already allocated to this project");
        }

        allocation.setProject(project);
        allocation.setEmployee(employee);
        allocation.setAllocationDate(LocalDate.now());

        return allocationRepository.save(allocation);
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
    public void removeAllocation(Long id) {
        ProjectAllocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Allocation not found with id: " + id));

        allocationRepository.delete(allocation);
    }

    private ProjectAllocationResponse mapToResponse(ProjectAllocation allocation) {
        return new ProjectAllocationResponse(
                allocation.getAllocationId(),
                allocation.getEmployee().getEmployeeId(),
                allocation.getEmployee().getFullName(),
                allocation.getProject().getProjectName(),
                allocation.getAllocatedRole(),
                allocation.getAllocationDate()
        );
    }
}