package com.resume.service.impl;

import com.resume.entity.Personal;
import com.resume.entity.User;
import com.resume.repository.PersonalRepository;
import com.resume.repository.UserRepository;
import com.resume.service.PersonalService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonalServiceImpl implements PersonalService {

    private final PersonalRepository personalRepository;

    private final UserRepository userRepository;

    public PersonalServiceImpl(
            PersonalRepository personalRepository,
            UserRepository userRepository) {

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
    // SAVE PERSONAL
    // =====================================================

    @Override
    public Personal save(Personal personal) {

        /*
         * NEVER trust user ID coming from frontend.
         *
         * Use the authenticated JWT user.
         */

        User currentUser =
                getCurrentUser();

        personal.setUser(currentUser);

        return personalRepository.save(personal);
    }

    // =====================================================
    // UPDATE PERSONAL
    // =====================================================

    @Override
    public Personal update(
            Long id,
            Personal personal) {

        Personal existing =
                personalRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Personal record not found with ID: "
                                                + id
                                )
                        );

        User currentUser =
                getCurrentUser();

        /*
         * Ownership check
         */

        if (existing.getUser() == null ||
                !existing.getUser()
                        .getId()
                        .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "You are not allowed to update this resume"
            );
        }

        existing.setFirstName(
                personal.getFirstName()
        );

        existing.setLastName(
                personal.getLastName()
        );

        existing.setEmail(
                personal.getEmail()
        );

        existing.setPhone(
                personal.getPhone()
        );

        existing.setAddress(
                personal.getAddress()
        );

        existing.setCity(
                personal.getCity()
        );

        existing.setState(
                personal.getState()
        );

        existing.setCountry(
                personal.getCountry()
        );

        existing.setPincode(
                personal.getPincode()
        );

        existing.setJobTitle(
                personal.getJobTitle()
        );

        existing.setLinkedin(
                personal.getLinkedin()
        );

        existing.setGithub(
                personal.getGithub()
        );

        existing.setSummary(
                personal.getSummary()
        );

        /*
         * Do NOT replace the owner using
         * personal.getUser().
         */

        existing.setUser(currentUser);

        return personalRepository.save(existing);
    }

    // =====================================================
    // GET PERSONAL BY USER
    // =====================================================

    @Override
    public List<Personal> getByUser(
            Long userId) {

        User currentUser =
                getCurrentUser();

        /*
         * User can only request
         * their own resumes.
         */

        if (!currentUser.getId().equals(userId)) {

            throw new RuntimeException(
                    "You are not allowed to access this user's resumes"
            );
        }

        return personalRepository
                .findByUserId(currentUser.getId());
    }

    // =====================================================
    // GET PERSONAL BY ID
    // =====================================================

    @Override
    public Personal getById(
            Long id) {

        Personal personal =
                personalRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Personal record not found with ID: "
                                                + id
                                )
                        );

        User currentUser =
                getCurrentUser();

        /*
         * Ownership check
         */

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
    // DELETE PERSONAL
    // =====================================================

    @Override
    public void delete(
            Long id) {

        Personal personal =
                personalRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Personal record not found with ID: "
                                                + id
                                )
                        );

        User currentUser =
                getCurrentUser();

        /*
         * Ownership check
         */

        if (personal.getUser() == null ||
                !personal.getUser()
                        .getId()
                        .equals(currentUser.getId())) {

            throw new RuntimeException(
                    "You are not allowed to delete this resume"
            );
        }

        personalRepository.delete(personal);
    }
}