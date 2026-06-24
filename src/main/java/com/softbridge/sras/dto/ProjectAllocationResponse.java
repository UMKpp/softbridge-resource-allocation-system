package com.softbridge.sras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ProjectAllocationResponse {

    private Long allocationId;
    private Long projectId;
    private String employeeId;
    private String employeeName;
    private String projectName;
    private String clientName;
    private String allocatedRole;
    private String requiredSkillName;
    private Integer requiredSkillLevel;
    private LocalDate allocationDate;
}
