package com.softbridge.sras.repository;

import com.softbridge.sras.model.EmployeeSkill;
import com.softbridge.sras.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeSkillRepository extends JpaRepository<EmployeeSkill, Long> {

    List<EmployeeSkill> findByEmployee(Employee employee);

    // Spring Data JPA automatically generates the SQL by analyzing this name!
    List<EmployeeSkill> findBySkillSkillNameAndSkillLevelGreaterThanEqual(String skillName, Integer skillLevel);
}
