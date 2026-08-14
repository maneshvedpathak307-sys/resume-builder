package com.resume.service.impl;

import com.resume.entity.Personal;
import com.resume.entity.User;
import com.resume.repository.PersonalRepository;
import com.resume.repository.UserRepository;
import com.resume.service.PersonalService;

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
    // SAVE PERSONAL
    // =====================================================

    @Override
    public Personal save(Personal personal) {

        /*
         * If User information is provided,
         * find the actual User from database.
         */
        if (personal.getUser() != null
                && personal.getUser().getId() != null) {

            Long userId = personal.getUser().getId();

            User user = userRepository
                    .findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found with ID: " + userId
                            )
                    );

            personal.setUser(user);
        }

        return personalRepository.save(personal);
    }


    // =====================================================
    // UPDATE PERSONAL
    // =====================================================

    @Override
    public Personal update(Long id, Personal personal) {

        /*
         * Find existing Personal record
         */
        Personal existing = personalRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Personal record not found with ID: " + id
                        )
                );


        /*
         * Update personal fields
         */
        existing.setFirstName(personal.getFirstName());

        existing.setLastName(personal.getLastName());

        existing.setEmail(personal.getEmail());

        existing.setPhone(personal.getPhone());

        existing.setAddress(personal.getAddress());

        existing.setCity(personal.getCity());

        existing.setState(personal.getState());

        existing.setCountry(personal.getCountry());

        existing.setPincode(personal.getPincode());

        existing.setJobTitle(personal.getJobTitle());

        existing.setLinkedin(personal.getLinkedin());

        existing.setGithub(personal.getGithub());

        existing.setSummary(personal.getSummary());


        /*
         * Update User relationship only if
         * User information was sent.
         */
        if (personal.getUser() != null
                && personal.getUser().getId() != null) {

            Long userId = personal.getUser().getId();

            User user = userRepository
                    .findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User not found with ID: " + userId
                            )
                    );

            existing.setUser(user);
        }


        /*
         * Save existing record
         */
        return personalRepository.save(existing);
    }


    // =====================================================
    // GET PERSONAL BY USER
    // =====================================================

    @Override
    public List<Personal> getByUser(Long userId) {

        return personalRepository.findByUserId(userId);
    }


    // =====================================================
    // GET PERSONAL BY ID
    // =====================================================

    @Override
    public Personal getById(Long id) {

        return personalRepository
                .findById(id)
                .orElse(null);
    }


    // =====================================================
    // DELETE PERSONAL
    // =====================================================

    @Override
    public void delete(Long id) {

        personalRepository.deleteById(id);
    }
}