package com.resume.controller;

import com.resume.entity.Certification;
import com.resume.service.CertificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/certifications")
@CrossOrigin(origins = "http://localhost:3000")
public class CertificationController {

    private final CertificationService service;

    public CertificationController(CertificationService service) {
        this.service = service;
    }

    @PostMapping
    public Certification save(@RequestBody Certification certification) {
        return service.saveCertification(certification);
    }
    
    @PutMapping("/{id}")
    public Certification update(@PathVariable Long id,
                                 @RequestBody Certification certification) {

        certification.setId(id);

        return service.saveCertification(certification);
    }

    @GetMapping("/personal/{id}")
    public ResponseEntity<List<Certification>> getByPersonalId(@PathVariable Long id) {
        return ResponseEntity.ok(
                service.getByPersonalId(id)
        );
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteCertification(id);
    }
}