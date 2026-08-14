package com.resume.service.impl;

import com.resume.entity.Language;
import com.resume.entity.Personal;
import com.resume.entity.User;
import com.resume.repository.LanguageRepository;
import com.resume.repository.PersonalRepository;
import com.resume.repository.UserRepository;
import com.resume.service.LanguageService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LanguageServiceImpl implements LanguageService {

    private final LanguageRepository repository;
    private final PersonalRepository personalRepository;
    private final UserRepository userRepository;

    public LanguageServiceImpl(
            LanguageRepository repository,
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
    // SAVE / UPDATE LANGUAGE
    // =====================================================

    @Override
    public Language saveLanguage(Language language) {

        if (language.getPersonal() == null ||
                language.getPersonal().getId() == null) {

            throw new RuntimeException(
                    "Personal ID is required for language."
            );
        }

        Long personalId =
                language.getPersonal().getId();

        Personal personal =
                getOwnedPersonal(personalId);


        // =================================================
        // UPDATE EXISTING LANGUAGE
        // =================================================

        if (language.getId() != null) {

            Language existing =
                    repository
                            .findById(language.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Language not found with id: "
                                                    + language.getId()
                                    )
                            );


            if (existing.getPersonal() == null ||
                    !existing.getPersonal()
                            .getId()
                            .equals(personalId)) {

                throw new RuntimeException(
                        "You are not allowed to update this language"
                );
            }


            existing.setLanguageName(
                    language.getLanguageName()
            );

            existing.setProficiency(
                    language.getProficiency()
            );

            existing.setPersonal(personal);

            return repository.save(existing);
        }


        // =================================================
        // CREATE NEW LANGUAGE
        // =================================================

        language.setPersonal(personal);

        return repository.save(language);
    }


    // =====================================================
    // GET LANGUAGES BY PERSONAL ID
    // =====================================================

    @Override
    public List<Language> getByPersonalId(Long personalId) {

        getOwnedPersonal(personalId);

        return repository.findByPersonalId(personalId);
    }


    // =====================================================
    // DELETE LANGUAGE
    // =====================================================

    @Override
    public void deleteLanguage(Long id) {

        Language language =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Language not found with id: "
                                                + id
                                )
                        );


        if (language.getPersonal() == null) {

            throw new RuntimeException(
                    "Language is not linked to a resume"
            );
        }


        getOwnedPersonal(
                language.getPersonal().getId()
        );


        repository.delete(language);
    }
}