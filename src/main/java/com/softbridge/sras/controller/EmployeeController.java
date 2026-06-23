package com.softbridge.sras.controller;

import com.softbridge.sras.dto.EmployeeAvailabilityResponse;
import com.softbridge.sras.dto.EmployeeRecommendationResponse;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.service.EmployeeService;
import com.softbridge.sras.service.EmployeeSkillService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService service;
    private final EmployeeSkillService employeeSkillService;

    public EmployeeController(EmployeeService service,
                              EmployeeSkillService employeeSkillService) {
        this.service = service;
        this.employeeSkillService = employeeSkillService;
    }

    @PostMapping
    public Employee createEmployee(
            @Valid @RequestBody Employee employee) {

        return service.createEmployee(employee);
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return service.getAllEmployees();
    }

    @GetMapping("/availability")
    public List<EmployeeAvailabilityResponse> getEmployeeAvailability() {
        return service.getEmployeeAvailability();
    }

    @GetMapping("/available")
    public List<EmployeeAvailabilityResponse> getAvailableEmployees() {
        return service.getAvailableEmployees();
    }

    @GetMapping("/recommend")
    public List<EmployeeRecommendationResponse> recommendEmployees(
            @RequestParam String skill,
            @RequestParam Integer level) {

        return service.recommendEmployeesBySkill(skill, level);
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable String id) {
        return service.getEmployeeById(id);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable String id,
            @Valid @RequestBody Employee employee) {

        return service.updateEmployee(id, employee);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable String id) {
        service.deleteEmployee(id);
    }
}