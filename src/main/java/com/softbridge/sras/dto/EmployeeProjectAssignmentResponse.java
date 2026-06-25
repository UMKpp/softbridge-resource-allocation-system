package com.softbridge.sras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeProjectAssignmentResponse {

    private Long id;
    private Long projectId;
    private String projectName;
    private String employeeId;
    private String employeeName;
    private String username;
    private String role;
    private String assignedBy;
    private String status;
}
