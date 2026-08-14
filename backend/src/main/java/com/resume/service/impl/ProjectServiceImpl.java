package com.resume.service.impl;

import com.resume.entity.Personal;
import com.resume.entity.Project;
import com.resume.entity.User;
import com.resume.repository.PersonalRepository;
import com.resume.repository.ProjectRepository;
import com.resume.repository.UserRepository;
import com.resume.service.ProjectService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository repository;

    private final PersonalRepository personalRepository;

    private final UserRepository userRepository;


    public ProjectServiceImpl(
            ProjectRepository repository,
            PersonalRepository personalRepository,
            UserRepository userRepository) {

        this.repository = repository;

        this.personalRepository = personalRepository;

        this.userRepository = userRepository;
    }


    // =====================================================
    // GET CURRENT LOGGED-IN USER
    // =====================================================

    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }

        String email =
                authentication.getName();

        return userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Logged-in user not found"
                        )
                );
    }


    // =====================================================
    // CHECK PERSONAL OWNERSHIP
    // =====================================================

    private Personal getOwnedPersonal(
            Long personalId) {

        Personal personal =
                personalRepository
                        .findById(personalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Personal not found with id: "
                                                + personalId
                                )
                        );


        User currentUser =
                getCurrentUser();


        if (personal.getUser() == null ||
                !personal.getUser()
                        .getId()
                        .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "You are not allowed to access this resume"
            );
        }


        return personal;
    }


    // =====================================================
    // SAVE / UPDATE PROJECT
    // =====================================================

    @Override
    public Project saveProject(Project project) {

        if (project.getPersonal() == null ||
                project.getPersonal().getId() == null) {

            throw new RuntimeException(
                    "Personal ID is required for project."
            );
        }


        Long personalId =
                project.getPersonal().getId();


        /*
         * Verify that the Personal record
         * belongs to the logged-in user.
         */

        Personal personal =
                getOwnedPersonal(personalId);


        // =================================================
        // UPDATE EXISTING PROJECT
        // =================================================

        if (project.getId() != null) {

            Project existing =
                    repository
                            .findById(project.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Project not found with id: "
                                                    + project.getId()
                                    )
                            );


            /*
             * Make sure the existing project
             * belongs to the same resume.
             */

            if (existing.getPersonal() == null ||
                    !existing.getPersonal()
                            .getId()
                            .equals(personalId)) {

                throw new RuntimeException(
                        "You are not allowed to update this project"
                );
            }


            existing.setTitle(
                    project.getTitle()
            );

            existing.setDescription(
                    project.getDescription()
            );

            existing.setGithubLink(
                    project.getGithubLink()
            );

            existing.setTechnology(
                    project.getTechnology()
            );

            existing.setLiveDemo(
                    project.getLiveDemo()
            );

            existing.setPersonal(personal);


            return repository.save(existing);
        }


        // =================================================
        // CREATE NEW PROJECT
        // =================================================

        project.setPersonal(personal);

        return repository.save(project);
    }


    // =====================================================
    // GET PROJECTS BY PERSONAL ID
    // =====================================================

    @Override
    public List<Project> getByPersonalId(
            Long personalId) {

        /*
         * Verify ownership before returning
         * project records.
         */

        getOwnedPersonal(personalId);


        return repository
                .findByPersonalId(personalId);
    }


    // =====================================================
    // DELETE PROJECT
    // =====================================================

    @Override
    public void deleteProject(Long id) {

        Project project =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Project not found with id: "
                                                + id
                                )
                        );


        if (project.getPersonal() == null) {

            throw new RuntimeException(
                    "Project is not linked to a resume"
            );
        }


        /*
         * Verify ownership before deleting.
         */

        getOwnedPersonal(
                project.getPersonal().getId()
        );


        repository.delete(project);
    }
}