package com.resume.service.impl;

import com.resume.entity.Certification;
import com.resume.entity.Personal;
import com.resume.entity.User;
import com.resume.repository.CertificationRepository;
import com.resume.repository.PersonalRepository;
import com.resume.repository.UserRepository;
import com.resume.service.CertificationService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CertificationServiceImpl
        implements CertificationService {

    private final CertificationRepository repository;
    private final PersonalRepository personalRepository;
    private final UserRepository userRepository;


    public CertificationServiceImpl(
            CertificationRepository repository,
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

    private Personal getOwnedPersonal(Long personalId) {

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
    // SAVE / UPDATE CERTIFICATION
    // =====================================================

    @Override
    public Certification saveCertification(
            Certification certification) {

        if (certification.getPersonal() == null ||
                certification.getPersonal().getId() == null) {

            throw new RuntimeException(
                    "Personal ID is required for certification."
            );
        }


        Long personalId =
                certification
                        .getPersonal()
                        .getId();


        Personal personal =
                getOwnedPersonal(personalId);


        // =================================================
        // UPDATE EXISTING CERTIFICATION
        // =================================================

        if (certification.getId() != null) {

            Certification existing =
                    repository
                            .findById(certification.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Certification not found with id: "
                                                    + certification.getId()
                                    )
                            );


            /*
             * Make sure certification belongs
             * to the same resume.
             */

            if (existing.getPersonal() == null ||
                    !existing.getPersonal()
                            .getId()
                            .equals(personalId)) {

                throw new RuntimeException(
                        "You are not allowed to update this certification"
                );
            }


            existing.setCertificationName(
                    certification.getCertificationName()
            );

            existing.setOrganization(
                    certification.getOrganization()
            );

            existing.setIssueDate(
                    certification.getIssueDate()
            );

            existing.setCertificateId(
                    certification.getCertificateId()
            );

            existing.setCertificateUrl(
                    certification.getCertificateUrl()
            );

            existing.setPersonal(personal);


            return repository.save(existing);
        }


        // =================================================
        // CREATE NEW CERTIFICATION
        // =================================================

        certification.setPersonal(personal);

        return repository.save(certification);
    }


    // =====================================================
    // GET CERTIFICATIONS BY PERSONAL ID
    // =====================================================

    @Override
    public List<Certification> getByPersonalId(
            Long personalId) {

        /*
         * Verify that this resume belongs
         * to the logged-in user.
         */

        getOwnedPersonal(personalId);


        return repository
                .findByPersonalId(personalId);
    }


    // =====================================================
    // DELETE CERTIFICATION
    // =====================================================

    @Override
    public void deleteCertification(Long id) {

        Certification certification =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Certification not found with id: "
                                                + id
                                )
                        );


        if (certification.getPersonal() == null) {

            throw new RuntimeException(
                    "Certification is not linked to a resume"
            );
        }


        /*
         * Verify ownership before deleting.
         */

        getOwnedPersonal(
                certification
                        .getPersonal()
                        .getId()
        );


        repository.delete(certification);
    }
}