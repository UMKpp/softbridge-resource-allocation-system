package com.softbridge.sras.repository;

import com.softbridge.sras.model.Employee;
import com.softbridge.sras.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByProjectManager(Employee projectManager);
}
