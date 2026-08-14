package com.resume.service;

import com.resume.entity.Personal;

import java.util.List;

public interface PersonalService {

    Personal save(Personal personal);

    Personal update(Long id, Personal personal);

    List<Personal> getByUser(Long userId);

    Personal getById(Long id);

    void delete(Long id);
}