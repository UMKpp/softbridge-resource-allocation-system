package com.softbridge.sras.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProjectManagerAvailabilityResponse {

    private String id;
    private String username;
    private String status;
}
