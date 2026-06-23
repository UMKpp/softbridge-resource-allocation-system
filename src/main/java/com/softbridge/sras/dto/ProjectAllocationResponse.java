package com.softbridge.sras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ProjectAllocationResponse {

    private Long allocationId;
    private String employeeId;
    private String employeeName;
    private String projectName;
    private String allocatedRole;
    private LocalDate allocationDate;
}