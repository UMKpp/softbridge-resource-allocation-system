package com.softbridge.sras.repository;

import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.Project;
import com.softbridge.sras.model.ProjectAllocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectAllocationRepository extends JpaRepository<ProjectAllocation, Long> {

    List<ProjectAllocation> findByProject(Project project);

    List<ProjectAllocation> findByEmployee(Employee employee);

    boolean existsByProjectAndEmployee(Project project, Employee employee);

    long countByEmployee(Employee employee);
}
