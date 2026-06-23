package com.softbridge.sras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeRecommendationResponse {

    private String employeeId;
    private String fullName;
    private String jobRole;
    private String skillName;
    private Integer skillLevel;
    private long projectCount;
    private String availabilityStatus;
}