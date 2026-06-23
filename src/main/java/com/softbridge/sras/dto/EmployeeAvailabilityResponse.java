package com.softbridge.sras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeAvailabilityResponse {

    private String employeeId;
    private String fullName;
    private String jobRole;
    private long projectCount;
    private String availabilityStatus;
}