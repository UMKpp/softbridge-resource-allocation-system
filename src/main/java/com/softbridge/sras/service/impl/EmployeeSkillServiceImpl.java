package com.softbridge.sras.service.impl;

import com.softbridge.sras.dto.EmployeeSearchResponse;
import com.softbridge.sras.dto.EmployeeSkillResponse;
import com.softbridge.sras.exception.ResourceNotFoundException;
import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.EmployeeSkill;
import com.softbridge.sras.model.Skill;
import com.softbridge.sras.repository.EmployeeRepository;
import com.softbridge.sras.repository.EmployeeSkillRepository;
import com.softbridge.sras.repository.SkillRepository;
import com.softbridge.sras.service.EmployeeSkillService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeSkillServiceImpl implements EmployeeSkillService {

    private final EmployeeSkillRepository employeeSkillRepository;
    private final EmployeeRepository employeeRepository;
    private final SkillRepository skillRepository;

    public EmployeeSkillServiceImpl(EmployeeSkillRepository employeeSkillRepository,
                                    EmployeeRepository employeeRepository,
                                    SkillRepository skillRepository) {
        this.employeeSkillRepository = employeeSkillRepository;
        this.employeeRepository = employeeRepository;
        this.skillRepository = skillRepository;
    }

    @Override
    public EmployeeSkillResponse assignSkill(EmployeeSkill employeeSkill) {

        String employeeId = employeeSkill.getEmployee().getEmployeeId();
        Long skillId = employeeSkill.getSkill().getSkillId();

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));

        employeeSkill.setEmployee(employee);
        employeeSkill.setSkill(skill);

        EmployeeSkill saved = employeeSkillRepository.save(employeeSkill);

        return mapToResponse(saved);
    }

    @Override
    public List<EmployeeSkillResponse> getSkillsByEmployeeId(String employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        return employeeSkillRepository.findByEmployee(employee)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<EmployeeSearchResponse> searchEmployees(String skill, Integer level) {

        List<EmployeeSkill> employeeSkills =
                employeeSkillRepository.findBySkillSkillNameAndSkillLevelGreaterThanEqual(skill, level);

        return employeeSkills.stream()
                .map(EmployeeSkill::getEmployee)
                .distinct()
                .map(emp -> {
                    Employee employeeWithSkills = employeeRepository.findByIdWithSkills(emp.getEmployeeId())
                            .orElse(emp);

                    return new EmployeeSearchResponse(
                            employeeWithSkills.getEmployeeId(),
                            employeeWithSkills.getFullName(),
                            employeeWithSkills.getSkills().stream()
                                    .filter(s -> s.getSkillLevel() >= level)
                                    .map(s -> new EmployeeSearchResponse.SkillInfo(
                                            s.getSkill().getSkillName(),
                                            s.getSkillLevel()
                                    ))
                                    .toList()
                    );
                })
                .toList();
    }

    @Override
    public EmployeeSkillResponse updateSkillLevel(Long id, Integer level) {

        EmployeeSkill es = employeeSkillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee skill not found with id: " + id));

        es.setSkillLevel(level);

        return mapToResponse(employeeSkillRepository.save(es));
    }

    @Override
    public void deleteEmployeeSkill(Long id) {
        EmployeeSkill es = employeeSkillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee skill not found with id: " + id));

        employeeSkillRepository.delete(es);
    }

    private EmployeeSkillResponse mapToResponse(EmployeeSkill es) {
        return new EmployeeSkillResponse(
                es.getId(),
                es.getEmployee().getEmployeeId(),
                es.getSkill().getSkillName(),
                es.getSkillLevel()
        );
    }
}