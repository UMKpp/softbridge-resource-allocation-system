package com.softbridge.sras.dto;

import lombok.Data;

@Data
public class ProjectAssignmentRequest {

    private String allocatedRole;
    private String role;
    private String skillName;
    private Integer skillLevel;

    public String getAssignmentRole() {
        if (role != null && !role.isBlank()) {
            return role;
        }

        return allocatedRole;
    }
}
