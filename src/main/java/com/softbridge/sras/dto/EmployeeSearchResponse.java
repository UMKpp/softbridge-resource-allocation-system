package com.softbridge.sras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeSearchResponse {

    private String employeeId;
    private String fullName;
    private String username;
    private String email;
    private String availabilityStatus;
}
