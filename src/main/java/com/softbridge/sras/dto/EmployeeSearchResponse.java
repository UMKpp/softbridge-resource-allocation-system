package com.softbridge.sras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class EmployeeSearchResponse {

    private String employeeId;
    private String fullName;
    private List<SkillInfo> skills;

    @Data
    @AllArgsConstructor
    public static class SkillInfo {
        private String skillName;
        private Integer level;
    }
}