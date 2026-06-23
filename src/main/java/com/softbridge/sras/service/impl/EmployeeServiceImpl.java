package com.softbridge.sras.service.impl;

import com.softbridge.sras.dto.EmployeeAvailabilityResponse;
import com.softbridge.sras.dto.EmployeeRecommendationResponse;
import com.softbridge.sras.exception.ResourceNotFoundException;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.repository.EmployeeRepository;
import com.softbridge.sras.repository.EmployeeSkillRepository;
import com.softbridge.sras.repository.ProjectAllocationRepository;
import com.softbridge.sras.service.EmployeeService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final ProjectAllocationRepository allocationRepository;
    private final EmployeeSkillRepository employeeSkillRepository;

    public EmployeeServiceImpl(EmployeeRepository employeeRepository,
                               ProjectAllocationRepository allocationRepository,
                               EmployeeSkillRepository employeeSkillRepository) {
        this.employeeRepository = employeeRepository;
        this.allocationRepository = allocationRepository;
        this.employeeSkillRepository = employeeSkillRepository;
    }

    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @Override
    public List<EmployeeAvailabilityResponse> getEmployeeAvailability() {

        return employeeRepository.findAll()
                .stream()
                .map(employee -> {

                    long projectCount =
                            allocationRepository.countByEmployee(employee);

                    String status;

                    if (projectCount == 0) {
                        status = "AVAILABLE";
                    } else if (projectCount == 1) {
                        status = "PARTIALLY_ALLOCATED";
                    } else {
                        status = "FULLY_ALLOCATED";
                    }

                    return new EmployeeAvailabilityResponse(
                            employee.getEmployeeId(),
                            employee.getFullName(),
                            employee.getJobRole(),
                            projectCount,
                            status
                    );
                })
                .toList();
    }

    @Override
    public List<EmployeeAvailabilityResponse> getAvailableEmployees() {

        return employeeRepository.findAll()
                .stream()
                .filter(employee ->
                        allocationRepository.countByEmployee(employee) == 0)
                .map(employee -> new EmployeeAvailabilityResponse(
                        employee.getEmployeeId(),
                        employee.getFullName(),
                        employee.getJobRole(),
                        0,
                        "AVAILABLE"
                ))
                .toList();
    }

    @Override
    public List<EmployeeRecommendationResponse> recommendEmployeesBySkill(String skill, Integer level) {

        return employeeSkillRepository.findBySkillSkillNameAndSkillLevelGreaterThanEqual(skill, level)
                .stream()
                .map(employeeSkill -> {

                    Employee employee = employeeSkill.getEmployee();

                    long projectCount =
                            allocationRepository.countByEmployee(employee);

                    String status;

                    if (projectCount == 0) {
                        status = "AVAILABLE";
                    } else if (projectCount == 1) {
                        status = "PARTIALLY_ALLOCATED";
                    } else {
                        status = "FULLY_ALLOCATED";
                    }

                    return new EmployeeRecommendationResponse(
                            employee.getEmployeeId(),
                            employee.getFullName(),
                            employee.getJobRole(),
                            employeeSkill.getSkill().getSkillName(),
                            employeeSkill.getSkillLevel(),
                            projectCount,
                            status
                    );
                })
                .filter(response ->
                        !response.getAvailabilityStatus().equals("FULLY_ALLOCATED"))
                .toList();
    }

    @Override
    public Employee getEmployeeById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id));
    }

    @Override
    public Employee updateEmployee(String id, Employee employee) {

        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id));

        existingEmployee.setUsername(employee.getUsername());
        existingEmployee.setPassword(employee.getPassword());
        existingEmployee.setFullName(employee.getFullName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setDepartment(employee.getDepartment());
        existingEmployee.setJobRole(employee.getJobRole());
        existingEmployee.setUserType(employee.getUserType());

        return employeeRepository.save(existingEmployee);
    }

    @Override
    public void deleteEmployee(String id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found with id: " + id));

        employeeRepository.delete(employee);
    }
}