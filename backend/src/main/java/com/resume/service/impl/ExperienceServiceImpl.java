package com.resume.service.impl;

import com.resume.entity.Experience;
import com.resume.entity.Personal;
import com.resume.entity.User;
import com.resume.repository.ExperienceRepository;
import com.resume.repository.PersonalRepository;
import com.resume.repository.UserRepository;
import com.resume.service.ExperienceService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExperienceServiceImpl
        implements ExperienceService {

    private final ExperienceRepository repository;

    private final PersonalRepository personalRepository;

    private final UserRepository userRepository;


    public ExperienceServiceImpl(
            ExperienceRepository repository,
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
                                        "Personal not found with ID: "
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
    // SAVE / UPDATE EXPERIENCE
    // =====================================================

    @Override
    public Experience saveExperience(
            Experience experience) {

        /*
         * Personal information is required.
         */

        if (experience.getPersonal() == null ||
                experience.getPersonal().getId() == null) {

            throw new RuntimeException(
                    "Personal ID is required for experience."
            );
        }


        Long personalId =
                experience.getPersonal().getId();


        /*
         * Find Personal and verify that
         * it belongs to the logged-in user.
         */

        Personal personal =
                getOwnedPersonal(personalId);


        // =================================================
        // UPDATE EXISTING EXPERIENCE
        // =================================================

        if (experience.getId() != null) {

            Experience existing =
                    repository
                            .findById(experience.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Experience not found with ID: "
                                                    + experience.getId()
                                    )
                            );


            /*
             * Make sure the existing experience
             * belongs to the same personal record.
             */

            if (existing.getPersonal() == null ||
                    !existing.getPersonal()
                            .getId()
                            .equals(personalId)) {

                throw new RuntimeException(
                        "You are not allowed to update this experience"
                );
            }


            existing.setCompany(
                    experience.getCompany()
            );

            existing.setDesignation(
                    experience.getDesignation()
            );

            existing.setEmploymentType(
                    experience.getEmploymentType()
            );

            existing.setStartDate(
                    experience.getStartDate()
            );

            existing.setEndDate(
                    experience.getEndDate()
            );

            existing.setCurrentWorking(
                    experience.isCurrentWorking()
            );

            existing.setDescription(
                    experience.getDescription()
            );

            existing.setPersonal(personal);


            return repository.save(existing);
        }


        // =================================================
        // CREATE NEW EXPERIENCE
        // =================================================

        experience.setPersonal(personal);

        return repository.save(experience);
    }


    // =====================================================
    // GET EXPERIENCE BY PERSONAL ID
    // =====================================================

    @Override
    public List<Experience> getByPersonalId(
            Long personalId) {

        /*
         * Verify ownership before returning
         * any experience records.
         */

        getOwnedPersonal(personalId);


        return repository
                .findByPersonalId(personalId);
    }


    // =====================================================
    // DELETE EXPERIENCE
    // =====================================================

    @Override
    public void deleteExperience(
            Long id) {

        Experience experience =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Experience not found with ID: "
                                                + id
                                )
                        );


        if (experience.getPersonal() == null) {

            throw new RuntimeException(
                    "Experience is not linked to a resume"
            );
        }


        /*
         * Verify that the experience belongs
         * to the logged-in user's resume.
         */

        getOwnedPersonal(
                experience.getPersonal().getId()
        );


        repository.delete(experience);
    }
}