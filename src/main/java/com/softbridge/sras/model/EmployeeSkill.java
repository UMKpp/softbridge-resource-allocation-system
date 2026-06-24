package com.softbridge.sras.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "employee_skills")
@Data
public class EmployeeSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "skill_id")
    private Skill skill;

    @NotNull(message = "Skill level is required")
    @Min(value = 1, message = "Skill level must be at least 1")
    @Max(value = 5, message = "Skill level must be at most 5")
    private Integer skillLevel;
}
