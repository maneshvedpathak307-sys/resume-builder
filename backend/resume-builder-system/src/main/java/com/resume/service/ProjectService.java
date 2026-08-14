package com.resume.service;

import com.resume.entity.Project;
import java.util.List;

public interface ProjectService {

    Project saveProject(Project project);

    List<Project> getByPersonalId(Long personalId);

    void deleteProject(Long id);
}