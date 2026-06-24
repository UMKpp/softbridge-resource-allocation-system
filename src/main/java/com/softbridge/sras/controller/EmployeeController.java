package com.softbridge.sras.controller;

import com.softbridge.sras.dto.EmployeeAvailabilityResponse;
import com.softbridge.sras.dto.EmployeeRecommendationResponse;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.security.RoleService;
import com.softbridge.sras.service.EmployeeService;
import com.softbridge.sras.service.EmployeeSkillService;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

    private final EmployeeService service;
    private final EmployeeSkillService employeeSkillService;
    private final RoleService roleService;

    public EmployeeController(EmployeeService service,
                              EmployeeSkillService employeeSkillService,
                              RoleService roleService) {
        this.service = service;
        this.employeeSkillService = employeeSkillService;
        this.roleService = roleService;
    }

    @PostMapping
    public Employee createEmployee(
            @Valid @RequestBody Employee employee) {

        employee.setUserType(roleService.normalizeRole(employee.getUserType()));
        return service.createEmployee(employee);
    }

    @GetMapping
    public List<Employee> getAllEmployees(Authentication authentication) {
        if (!roleService.hasRole(authentication, "HR")) {
            throw new AccessDeniedException("Access denied");
        }

        return service.getAllEmployees();
    }

    @GetMapping("/availability")
    public List<EmployeeAvailabilityResponse> getEmployeeAvailability(Authentication authentication) {
        if (!roleService.hasRole(authentication, "HR") && !roleService.hasRole(authentication, "PM")) {
            throw new AccessDeniedException("Access denied");
        }

        return service.getEmployeeAvailability();
    }

    @GetMapping("/available")
    public List<EmployeeAvailabilityResponse> getAvailableEmployees(Authentication authentication) {
        if (!roleService.hasRole(authentication, "HR") && !roleService.hasRole(authentication, "PM")) {
            throw new AccessDeniedException("Access denied");
        }

        return service.getAvailableEmployees();
    }

    @GetMapping("/recommend")
    public List<EmployeeRecommendationResponse> recommendEmployees(
            @RequestParam String skill,
            @RequestParam Integer level,
            Authentication authentication) {

        if (!roleService.hasRole(authentication, "HR") && !roleService.hasRole(authentication, "PM")) {
            throw new AccessDeniedException("Access denied");
        }

        return service.recommendEmployeesBySkill(skill, level);
    }

    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable String id, Authentication authentication) {
        if (roleService.hasRole(authentication, "EMPLOYEE") && !roleService.isCurrentEmployee(authentication, id)) {
            throw new AccessDeniedException("Access denied");
        }

        return service.getEmployeeById(id);
    }

    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable String id,
            @RequestBody Employee employee,
            Authentication authentication) {

        Employee existingEmployee = service.getEmployeeById(id);

        if (roleService.hasRole(authentication, "EMPLOYEE")) {
            if (!roleService.isCurrentEmployee(authentication, id)) {
                throw new AccessDeniedException("Access denied");
            }

            employee.setEmployeeId(existingEmployee.getEmployeeId());
            employee.setUsername(existingEmployee.getUsername());
            employee.setPassword(existingEmployee.getPassword());
            employee.setUserType(existingEmployee.getUserType());
        } else {
            employee.setUserType(roleService.normalizeRole(employee.getUserType()));

            if (employee.getPassword() == null || employee.getPassword().isBlank()) {
                employee.setPassword(existingEmployee.getPassword());
            }
        }

        return service.updateEmployee(id, employee);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable String id) {
        service.deleteEmployee(id);
    }
}
