package com.resume.controller;

import com.resume.entity.Personal;
import com.resume.service.PersonalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(origins = "http://localhost:3000")
public class PersonalController {

    private final PersonalService service;

    public PersonalController(PersonalService service) {
        this.service = service;
    }

    @PostMapping
    public Personal save(@RequestBody Personal personal) {

        return service.save(personal);
    }


    @PutMapping("/{id}")
    public Personal update(
            @PathVariable Long id,
            @RequestBody Personal personal) {

        return service.update(id, personal);
    }


    @GetMapping("/user/{userId}")
    public List<Personal> getByUser(
            @PathVariable Long userId) {

        return service.getByUser(userId);
    }


    @GetMapping("/{id}")
    public Personal getById(
            @PathVariable Long id) {

        return service.getById(id);
    }


    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        service.delete(id);
    }
}