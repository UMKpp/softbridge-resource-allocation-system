package com.softbridge.sras.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Entity
@Table(name = "projects")
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    @NotBlank(message = "Project name is required")
    private String projectName;

    @NotBlank(message = "Client name is required")
    private String clientName;

    private String description;

    @NotBlank(message = "Status is required")
    private String status;

    @ManyToOne
    @JoinColumn(name = "project_manager_id")
    private Employee projectManager;

    private String requiredSkillName;

    @Min(value = 1, message = "Required skill level must be at least 1")
    @Max(value = 5, message = "Required skill level must be at most 5")
    private Integer requiredSkillLevel;
}
