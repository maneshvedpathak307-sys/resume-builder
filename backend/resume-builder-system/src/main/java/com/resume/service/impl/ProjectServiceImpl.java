package com.resume.service.impl;

import com.resume.entity.Personal;
import com.resume.entity.Project;
import com.resume.repository.PersonalRepository;
import com.resume.repository.ProjectRepository;
import com.resume.service.ProjectService;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository repository;
    private final PersonalRepository personalRepository;

    public ProjectServiceImpl(
            ProjectRepository repository,
            PersonalRepository personalRepository) {

        this.repository = repository;
        this.personalRepository = personalRepository;
    }

    @Override
    public Project saveProject(Project project) {

        if (project.getPersonal() != null
                && project.getPersonal().getId() != null) {

            Long personalId =
                    project.getPersonal().getId();

            Personal personal =
                    personalRepository.findById(personalId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Personal not found with id: "
                                                    + personalId
                                    )
                            );

            project.setPersonal(personal);
        }

        return repository.save(project);
    }

    @Override
    public List<Project> getByPersonalId(Long personalId) {

        return repository.findByPersonalId(personalId);
    }

    @Override
    public void deleteProject(Long id) {

        repository.deleteById(id);
    }
}