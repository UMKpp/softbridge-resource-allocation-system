package com.softbridge.sras.repository;

import com.softbridge.sras.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}