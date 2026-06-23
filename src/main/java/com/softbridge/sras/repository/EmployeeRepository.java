package com.softbridge.sras.repository;

import com.softbridge.sras.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    @Query("SELECT e FROM Employee e LEFT JOIN FETCH e.skills WHERE e.employeeId = :employeeId")
    Optional<Employee> findByIdWithSkills(String employeeId);

    Optional<Employee> findByUsername(String username);
}
