package com.softbridge.sras.service;

import com.softbridge.sras.dto.EmployeeSearchResponse;
import com.softbridge.sras.dto.EmployeeSkillResponse;
import com.softbridge.sras.model.EmployeeSkill;

import java.util.List;

public interface EmployeeSkillService {

    EmployeeSkillResponse assignSkill(EmployeeSkill employeeSkill);

    List<EmployeeSkillResponse> getSkillsByEmployeeId(String employeeId);

    List<EmployeeSearchResponse> searchEmployees(String skill, Integer level);

    EmployeeSkillResponse updateSkillLevel(Long id, Integer level);

    void deleteEmployeeSkill(Long id);
}
