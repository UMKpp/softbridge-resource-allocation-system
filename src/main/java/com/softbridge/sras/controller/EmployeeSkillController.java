package com.softbridge.sras.controller;

import com.softbridge.sras.dto.EmployeeSearchResponse;
import com.softbridge.sras.dto.EmployeeSkillResponse;
import com.softbridge.sras.model.EmployeeSkill;
import com.softbridge.sras.security.RoleService;
import com.softbridge.sras.service.EmployeeSkillService;
import jakarta.validation.Valid;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee-skills")
public class EmployeeSkillController {

    private final EmployeeSkillService employeeSkillService;
    private final RoleService roleService;

    public EmployeeSkillController(EmployeeSkillService employeeSkillService,
                                   RoleService roleService) {
        this.employeeSkillService = employeeSkillService;
        this.roleService = roleService;
    }

    @PostMapping
    public EmployeeSkillResponse assignSkill(@Valid @RequestBody EmployeeSkill employeeSkill) {
        return employeeSkillService.assignSkill(employeeSkill);
    }

    @GetMapping("/employee/{employeeId}")
    public List<EmployeeSkillResponse> getSkillsByEmployee(@PathVariable String employeeId,
                                                           Authentication authentication) {
        if (roleService.hasRole(authentication, "EMPLOYEE") && !roleService.isCurrentEmployee(authentication, employeeId)) {
            throw new AccessDeniedException("Access denied");
        }

        return employeeSkillService.getSkillsByEmployeeId(employeeId);
    }

    @GetMapping("/employees/search")
    public List<EmployeeSearchResponse> searchEmployees(@RequestParam String skill,
                                                        @RequestParam Integer level,
                                                        Authentication authentication) {
        if (!roleService.hasRole(authentication, "HR") && !roleService.hasRole(authentication, "PM")) {
            throw new AccessDeniedException("Access denied");
        }

        return employeeSkillService.searchEmployees(skill, level);
    }

    @PutMapping("/{id}")
    public EmployeeSkillResponse updateSkillLevel(@PathVariable Long id,
                                                  @RequestParam Integer level) {
        return employeeSkillService.updateSkillLevel(id, level);
    }

    @DeleteMapping("/{id}")
    public void deleteEmployeeSkill(@PathVariable Long id) {
        employeeSkillService.deleteEmployeeSkill(id);
    }
}
