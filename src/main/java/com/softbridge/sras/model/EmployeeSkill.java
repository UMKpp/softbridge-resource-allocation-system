package com.softbridge.sras.model;

import jakarta.persistence.*;
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

    // 1 = Low, 2 = Intermediate, 3 = Expert
    private Integer skillLevel;
}
