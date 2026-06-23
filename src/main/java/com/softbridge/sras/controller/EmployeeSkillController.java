package com.softbridge.sras.controller;

import com.softbridge.sras.dto.EmployeeSkillResponse;
import com.softbridge.sras.dto.EmployeeSearchResponse;
import com.softbridge.sras.model.EmployeeSkill;
import com.softbridge.sras.service.EmployeeSkillService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employee-skills")
public class EmployeeSkillController {

    private final EmployeeSkillService employeeSkillService;

    public EmployeeSkillController(EmployeeSkillService employeeSkillService) {
        this.employeeSkillService = employeeSkillService;
    }

    // Assign skill to employee
    @PostMapping
    public EmployeeSkillResponse assignSkill(@RequestBody EmployeeSkill employeeSkill) {
        return employeeSkillService.assignSkill(employeeSkill);
    }

    // Get skills of an employee
    @GetMapping("/employee/{employeeId}")
    public List<EmployeeSkillResponse> getSkillsByEmployee(@PathVariable String employeeId) {
        return employeeSkillService.getSkillsByEmployeeId(employeeId);
    }

    @GetMapping("/employees/search")
    public List<EmployeeSearchResponse> searchEmployees(@RequestParam String skill,
                                                        @RequestParam Integer level) {
        return employeeSkillService.searchEmployees(skill, level);
    }

    // Update skill level
    @PutMapping("/{id}")
    public EmployeeSkillResponse updateSkillLevel(@PathVariable Long id,
                                                  @RequestParam Integer level) {
        return employeeSkillService.updateSkillLevel(id, level);
    }

    // Delete employee skill
    @DeleteMapping("/{id}")
    public void deleteEmployeeSkill(@PathVariable Long id) {
        employeeSkillService.deleteEmployeeSkill(id);
    }
}
