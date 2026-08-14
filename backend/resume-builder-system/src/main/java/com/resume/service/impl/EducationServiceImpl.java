package com.resume.service.impl;

import com.resume.entity.Education;
import com.resume.entity.Personal;
import com.resume.entity.User;
import com.resume.repository.EducationRepository;
import com.resume.repository.PersonalRepository;
import com.resume.repository.UserRepository;
import com.resume.service.EducationService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;

    private final PersonalRepository personalRepository;

    private final UserRepository userRepository;


    public EducationServiceImpl(
            EducationRepository educationRepository,
            PersonalRepository personalRepository,
            UserRepository userRepository) {

        this.educationRepository = educationRepository;

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

    private Personal getOwnedPersonal(Long personalId) {

        Personal personal =
                personalRepository
                        .findById(personalId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Personal record not found with ID: "
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
    // SAVE / CREATE / UPDATE
    // =====================================================

    @Override
    public Education save(Education education) {

        if (education.getPersonal() == null ||
                education.getPersonal().getId() == null) {

            throw new RuntimeException(
                    "Personal ID is required for education."
            );
        }


        Long personalId =
                education.getPersonal().getId();


        /*
         * Find personal record and verify
         * that it belongs to logged-in user.
         */

        Personal personal =
                getOwnedPersonal(personalId);


        /*
         * =================================================
         * UPDATE EXISTING EDUCATION
         * =================================================
         */

        if (education.getId() != null) {

            Education existing =
                    educationRepository
                            .findById(education.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Education record not found with ID: "
                                                    + education.getId()
                                    )
                            );


            /*
             * Make sure existing education
             * belongs to the same personal record.
             */

            if (existing.getPersonal() == null ||
                    !existing.getPersonal()
                            .getId()
                            .equals(personalId)) {

                throw new RuntimeException(
                        "You are not allowed to update this education"
                );
            }


            existing.setDegree(
                    education.getDegree()
            );

            existing.setCollege(
                    education.getCollege()
            );

            existing.setUniversity(
                    education.getUniversity()
            );

            existing.setStartYear(
                    education.getStartYear()
            );

            existing.setEndYear(
                    education.getEndYear()
            );

            existing.setPercentage(
                    education.getPercentage()
            );

            existing.setPersonal(personal);


            return educationRepository.save(existing);
        }


        /*
         * =================================================
         * CREATE NEW EDUCATION
         * =================================================
         */

        education.setPersonal(personal);

        return educationRepository.save(education);
    }


    // =====================================================
    // GET EDUCATION BY PERSONAL ID
    // =====================================================

    @Override
    public List<Education> getByPersonalId(
            Long personalId) {

        /*
         * This also checks ownership.
         */

        getOwnedPersonal(personalId);


        return educationRepository
                .findByPersonalId(personalId);
    }


    // =====================================================
    // GET ONE EDUCATION
    // =====================================================

    @Override
    public Education getById(Long id) {

        Education education =
                educationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Education record not found with ID: "
                                                + id
                                )
                        );


        if (education.getPersonal() == null) {

            throw new RuntimeException(
                    "Education is not linked to a resume"
            );
        }


        /*
         * Verify that the resume belongs
         * to the logged-in user.
         */

        getOwnedPersonal(
                education.getPersonal().getId()
        );


        return education;
    }


    // =====================================================
    // DELETE
    // =====================================================

    @Override
    public void delete(Long id) {

        Education education =
                educationRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Education record not found with ID: "
                                                + id
                                )
                        );


        if (education.getPersonal() == null) {

            throw new RuntimeException(
                    "Education is not linked to a resume"
            );
        }


        /*
         * Verify ownership before deleting.
         */

        getOwnedPersonal(
                education.getPersonal().getId()
        );


        educationRepository.delete(education);
    }
}