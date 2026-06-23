package com.softbridge.sras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeSkillResponse {

    private Long id;
    private String employeeId;
    private String skillName;
    private Integer skillLevel;
}