package com.resume.service.impl;

import com.resume.entity.Personal;
import com.resume.entity.Skill;
import com.resume.entity.User;
import com.resume.repository.PersonalRepository;
import com.resume.repository.SkillRepository;
import com.resume.repository.UserRepository;
import com.resume.service.SkillService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository repository;

    private final PersonalRepository personalRepository;

    private final UserRepository userRepository;


    public SkillServiceImpl(
            SkillRepository repository,
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
    // SAVE / UPDATE SKILL
    // =====================================================

    @Override
    public Skill saveSkill(Skill skill) {

        if (skill.getPersonal() == null ||
                skill.getPersonal().getId() == null) {

            throw new RuntimeException(
                    "Personal ID is required for skill."
            );
        }


        Long personalId =
                skill.getPersonal().getId();


        /*
         * Verify that the Personal record
         * belongs to the logged-in user.
         */

        Personal personal =
                getOwnedPersonal(personalId);


        // =================================================
        // UPDATE EXISTING SKILL
        // =================================================

        if (skill.getId() != null) {

            Skill existing =
                    repository
                            .findById(skill.getId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Skill not found with ID: "
                                                    + skill.getId()
                                    )
                            );


            /*
             * Make sure the existing skill
             * belongs to the same resume.
             */

            if (existing.getPersonal() == null ||
                    !existing.getPersonal()
                            .getId()
                            .equals(personalId)) {

                throw new RuntimeException(
                        "You are not allowed to update this skill"
                );
            }


            existing.setSkillName(
                    skill.getSkillName()
            );

            existing.setLevel(
                    skill.getLevel()
            );

            existing.setPersonal(personal);


            return repository.save(existing);
        }


        // =================================================
        // CREATE NEW SKILL
        // =================================================

        skill.setPersonal(personal);

        return repository.save(skill);
    }


    // =====================================================
    // GET SKILLS BY PERSONAL ID
    // =====================================================

    @Override
    public List<Skill> getByPersonalId(
            Long personalId) {

        /*
         * Verify ownership before returning skills.
         */

        getOwnedPersonal(personalId);


        return repository
                .findByPersonalId(personalId);
    }


    // =====================================================
    // DELETE SKILL
    // =====================================================

    @Override
    public void deleteSkill(Long id) {

        Skill skill =
                repository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Skill not found with ID: "
                                                + id
                                )
                        );


        if (skill.getPersonal() == null) {

            throw new RuntimeException(
                    "Skill is not linked to a resume"
            );
        }


        /*
         * Verify ownership before deleting.
         */

        getOwnedPersonal(
                skill.getPersonal().getId()
        );


        repository.delete(skill);
    }
}