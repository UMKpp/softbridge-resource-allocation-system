package com.softbridge.sras.model;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;


import java.util.List;

@Entity
@Table(name = "employees")
@Data
public class Employee {

    @Id
    @Column(name = "employee_id")
    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "Username is required")
    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Job role is required")
    private String jobRole;

    @NotBlank(message = "User type is required")
    private String userType;

    @JsonIgnore
    @OneToMany(mappedBy = "employee")
    private List<EmployeeSkill> skills;
}