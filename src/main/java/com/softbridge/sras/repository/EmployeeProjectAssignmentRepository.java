package com.softbridge.sras.repository;

import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.EmployeeProjectAssignment;
import com.softbridge.sras.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeProjectAssignmentRepository extends JpaRepository<EmployeeProjectAssignment, Long> {

    List<EmployeeProjectAssignment> findByProject(Project project);

    List<EmployeeProjectAssignment> findByEmployee(Employee employee);

    boolean existsByProjectAndEmployeeAndStatus(Project project, Employee employee, String status);
}
