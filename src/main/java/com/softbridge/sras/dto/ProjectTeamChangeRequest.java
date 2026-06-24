package com.softbridge.sras.dto;

import lombok.Data;

@Data
public class ProjectTeamChangeRequest {

    private Long assignmentId;
    private String employeeId;
    private String role;
}
