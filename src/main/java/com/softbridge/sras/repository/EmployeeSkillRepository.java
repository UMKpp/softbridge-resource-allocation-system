package com.softbridge.sras.repository;

import com.softbridge.sras.model.EmployeeSkill;
import com.softbridge.sras.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface EmployeeSkillRepository extends JpaRepository<EmployeeSkill, Long> {

    List<EmployeeSkill> findByEmployee(Employee employee);

    Optional<EmployeeSkill> findByEmployeeAndSkillSkillNameIgnoreCase(Employee employee, String skillName);

    List<EmployeeSkill> findBySkillSkillNameIgnoreCaseAndSkillLevelGreaterThanEqual(String skillName, Integer skillLevel);
}
