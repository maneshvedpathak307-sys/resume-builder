package com.resume.controller;

import com.resume.entity.Education;
import com.resume.service.EducationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/education")
@CrossOrigin(origins = "http://localhost:3000")
public class EducationController {

    private final EducationService service;

    public EducationController(
            EducationService service) {

        this.service = service;
    }


    // CREATE
    @PostMapping
    public Education save(
            @RequestBody Education education) {

        return service.save(education);

    }


    // UPDATE
    @PutMapping("/{id}")
    public Education update(
            @PathVariable Long id,
            @RequestBody Education education) {

        education.setId(id);

        return service.save(education);

    }


    // GET ALL EDUCATION FOR PERSONAL ID
    @GetMapping("/personal/{personalId}")
    public List<Education> getByPersonalId(
            @PathVariable Long personalId) {

        return service.getByPersonalId(personalId);

    }


    // GET ONE
    @GetMapping("/{id}")
    public Education getById(
            @PathVariable Long id) {

        return service.getById(id);

    }


    // DELETE
    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        service.delete(id);

    }
}