package com.softbridge.sras.service;

import com.softbridge.sras.dto.EmployeeSearchResponse;
import com.softbridge.sras.dto.EmployeeSkillRequest;
import com.softbridge.sras.dto.EmployeeSkillResponse;
import com.softbridge.sras.model.EmployeeSkill;

import java.util.List;

public interface EmployeeSkillService {

    EmployeeSkillResponse assignSkill(EmployeeSkill employeeSkill);

    EmployeeSkillResponse addSkillToEmployee(String employeeId, EmployeeSkillRequest request);

    List<EmployeeSkillResponse> getSkillsByEmployeeId(String employeeId);

    List<EmployeeSearchResponse> searchEmployees(String skill, Integer level);

    EmployeeSkillResponse updateSkillLevel(Long id, Integer level);

    EmployeeSkillResponse updateEmployeeSkill(String employeeId, Long id, EmployeeSkillRequest request);

    void deleteEmployeeSkill(Long id);

    void deleteEmployeeSkill(String employeeId, Long id);
}
