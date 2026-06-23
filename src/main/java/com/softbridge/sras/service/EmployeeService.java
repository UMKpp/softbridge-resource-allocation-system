package com.softbridge.sras.service;

import com.softbridge.sras.dto.EmployeeAvailabilityResponse;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.dto.EmployeeRecommendationResponse;

import java.util.List;

public interface EmployeeService {

    Employee createEmployee(Employee employee);

    List<Employee> getAllEmployees();

    List<EmployeeAvailabilityResponse> getEmployeeAvailability();

    List<EmployeeAvailabilityResponse> getAvailableEmployees();

    List<EmployeeRecommendationResponse> recommendEmployeesBySkill(String skill, Integer level);

    Employee getEmployeeById(String id);

    Employee updateEmployee(String id, Employee employee);

    void deleteEmployee(String id);
}