package com.softbridge.sras.model;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "skills")
@Data
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "skill_id")
    private Long skillId;

    @NotBlank(message = "Skill name is required")
    @Column(name = "skill_name", nullable = false, unique = true)
    private String skillName;

    @NotBlank(message = "Skill category is required")
    @Column(name = "skill_category", nullable = false)
    private String skillCategory;
}