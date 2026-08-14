package com.resume.controller;

import com.resume.entity.Experience;
import com.resume.service.ExperienceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experience")
@CrossOrigin(origins = "http://localhost:3000")
public class ExperienceController {

    private final ExperienceService service;


    public ExperienceController(
            ExperienceService service) {

        this.service = service;
    }


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    public Experience save(
            @RequestBody Experience experience) {

        return service.saveExperience(experience);
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public Experience update(
            @PathVariable Long id,
            @RequestBody Experience experience) {

        experience.setId(id);

        return service.saveExperience(experience);
    }


    // =====================================================
    // GET BY PERSONAL ID
    // =====================================================

    @GetMapping("/personal/{id}")
    public ResponseEntity<List<Experience>>
    getByPersonalId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                service.getByPersonalId(id)
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        service.deleteExperience(id);
    }
}