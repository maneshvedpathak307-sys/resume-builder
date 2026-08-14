package com.resume.controller;

import com.resume.entity.Language;
import com.resume.service.LanguageService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
@CrossOrigin(origins = "http://localhost:3000")
public class LanguageController {

    private final LanguageService service;

    public LanguageController(LanguageService service) {
        this.service = service;
    }

    @PostMapping
    public Language save(@RequestBody Language language) {
        return service.saveLanguage(language);
    }
    
    @PutMapping("/{id}")
    public Language update(@PathVariable Long id,
                           @RequestBody Language language) {

        language.setId(id);

        return service.saveLanguage(language);
    }

    @GetMapping("/personal/{id}")
    public ResponseEntity<List<Language>> getByPersonalId(@PathVariable Long id) {
        return ResponseEntity.ok(
                service.getByPersonalId(id)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteLanguage(id);
    }
}