package com.softbridge.sras.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EmployeeSkillRequest {

    private Long skillId;

    @NotBlank(message = "Skill name is required")
    private String skillName;

    @NotBlank(message = "Skill category is required")
    private String skillCategory;

    @NotNull(message = "Skill level is required")
    @Min(value = 1, message = "Skill level must be at least 1")
    @Max(value = 3, message = "Skill level must be at most 3")
    private Integer skillLevel;
}
