package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Consulta;
import com.mycompany.myapp.repository.ConsultaRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Consulta}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ConsultaResource {

    private final Logger log = LoggerFactory.getLogger(ConsultaResource.class);

    private static final String ENTITY_NAME = "consulta";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConsultaRepository consultaRepository;

    public ConsultaResource(ConsultaRepository consultaRepository) {
        this.consultaRepository = consultaRepository;
    }

    /**
     * {@code POST  /consultas} : Create a new consulta.
     *
     * @param consulta the consulta to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new consulta, or with status {@code 400 (Bad Request)} if the consulta has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/consultas")
    public ResponseEntity<Consulta> createConsulta(@RequestBody Consulta consulta) throws URISyntaxException {
        log.debug("REST request to save Consulta : {}", consulta);
        if (consulta.getId() != null) {
            throw new BadRequestAlertException("A new consulta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Consulta result = consultaRepository.save(consulta);
        return ResponseEntity
            .created(new URI("/api/consultas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /consultas/:id} : Updates an existing consulta.
     *
     * @param id the id of the consulta to save.
     * @param consulta the consulta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consulta,
     * or with status {@code 400 (Bad Request)} if the consulta is not valid,
     * or with status {@code 500 (Internal Server Error)} if the consulta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/consultas/{id}")
    public ResponseEntity<Consulta> updateConsulta(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consulta consulta
    ) throws URISyntaxException {
        log.debug("REST request to update Consulta : {}, {}", id, consulta);
        if (consulta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consulta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consultaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Consulta result = consultaRepository.save(consulta);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consulta.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /consultas/:id} : Partial updates given fields of an existing consulta, field will ignore if it is null
     *
     * @param id the id of the consulta to save.
     * @param consulta the consulta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated consulta,
     * or with status {@code 400 (Bad Request)} if the consulta is not valid,
     * or with status {@code 404 (Not Found)} if the consulta is not found,
     * or with status {@code 500 (Internal Server Error)} if the consulta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/consultas/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Consulta> partialUpdateConsulta(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Consulta consulta
    ) throws URISyntaxException {
        log.debug("REST request to partial update Consulta partially : {}, {}", id, consulta);
        if (consulta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, consulta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!consultaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Consulta> result = consultaRepository
            .findById(consulta.getId())
            .map(
                existingConsulta -> {
                    if (consulta.getProcedimento() != null) {
                        existingConsulta.setProcedimento(consulta.getProcedimento());
                    }
                    if (consulta.getTipoConsulta() != null) {
                        existingConsulta.setTipoConsulta(consulta.getTipoConsulta());
                    }

                    return existingConsulta;
                }
            )
            .map(consultaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, consulta.getId().toString())
        );
    }

    /**
     * {@code GET  /consultas} : get all the consultas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of consultas in body.
     */
    @GetMapping("/consultas")
    public List<Consulta> getAllConsultas() {
        log.debug("REST request to get all Consultas");
        return consultaRepository.findAll();
    }

    /**
     * {@code GET  /consultas/:id} : get the "id" consulta.
     *
     * @param id the id of the consulta to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the consulta, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/consultas/{id}")
    public ResponseEntity<Consulta> getConsulta(@PathVariable Long id) {
        log.debug("REST request to get Consulta : {}", id);
        Optional<Consulta> consulta = consultaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(consulta);
    }

    /**
     * {@code DELETE  /consultas/:id} : delete the "id" consulta.
     *
     * @param id the id of the consulta to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/consultas/{id}")
    public ResponseEntity<Void> deleteConsulta(@PathVariable Long id) {
        log.debug("REST request to delete Consulta : {}", id);
        consultaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
