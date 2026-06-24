package com.softbridge.sras.controller;

import com.softbridge.sras.dto.EmployeeSkillRequest;
import com.softbridge.sras.dto.EmployeeSkillResponse;
import com.softbridge.sras.model.Skill;
import com.softbridge.sras.security.RoleService;
import com.softbridge.sras.service.EmployeeSkillService;
import com.softbridge.sras.service.SkillService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/skills")
public class SkillController {

    private final SkillService skillService;
    private final EmployeeSkillService employeeSkillService;
    private final RoleService roleService;

    public SkillController(SkillService skillService,
                           EmployeeSkillService employeeSkillService,
                           RoleService roleService) {
        this.skillService = skillService;
        this.employeeSkillService = employeeSkillService;
        this.roleService = roleService;
    }

    @PostMapping
    public Skill createSkill(@Valid @RequestBody Skill skill) {
        return skillService.createSkill(skill);
    }

    @GetMapping
    public List<Skill> getAllSkills() {
        return skillService.getAllSkills();
    }

    @GetMapping("/me")
    public List<EmployeeSkillResponse> getMySkills(Authentication authentication) {
        return employeeSkillService.getSkillsByEmployeeId(
                roleService.getCurrentEmployee(authentication).getEmployeeId()
        );
    }

    @PostMapping("/me")
    public EmployeeSkillResponse addMySkill(@Valid @RequestBody EmployeeSkillRequest request,
                                            Authentication authentication) {
        return employeeSkillService.addSkillToEmployee(
                roleService.getCurrentEmployee(authentication).getEmployeeId(),
                request
        );
    }

    @PutMapping("/me/{id}")
    public EmployeeSkillResponse updateMySkill(@PathVariable Long id,
                                               @Valid @RequestBody EmployeeSkillRequest request,
                                               Authentication authentication) {
        return employeeSkillService.updateEmployeeSkill(
                roleService.getCurrentEmployee(authentication).getEmployeeId(),
                id,
                request
        );
    }

    @DeleteMapping("/me/{id}")
    public void deleteMySkill(@PathVariable Long id, Authentication authentication) {
        employeeSkillService.deleteEmployeeSkill(
                roleService.getCurrentEmployee(authentication).getEmployeeId(),
                id
        );
    }

    @GetMapping("/{id}")
    public Skill getSkillById(@PathVariable Long id) {
        return skillService.getSkillById(id);
    }

    @PutMapping("/{id}")
    public Skill updateSkill(@PathVariable Long id, @Valid @RequestBody Skill skill) {
        return skillService.updateSkill(id, skill);
    }

    @DeleteMapping("/{id}")
    public void deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
    }
}
