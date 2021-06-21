package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Laudo;
import com.mycompany.myapp.repository.LaudoRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Laudo}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LaudoResource {

    private final Logger log = LoggerFactory.getLogger(LaudoResource.class);

    private static final String ENTITY_NAME = "laudo";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LaudoRepository laudoRepository;

    public LaudoResource(LaudoRepository laudoRepository) {
        this.laudoRepository = laudoRepository;
    }

    /**
     * {@code POST  /laudos} : Create a new laudo.
     *
     * @param laudo the laudo to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new laudo, or with status {@code 400 (Bad Request)} if the laudo has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/laudos")
    public ResponseEntity<Laudo> createLaudo(@RequestBody Laudo laudo) throws URISyntaxException {
        log.debug("REST request to save Laudo : {}", laudo);
        if (laudo.getId() != null) {
            throw new BadRequestAlertException("A new laudo cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Laudo result = laudoRepository.save(laudo);
        return ResponseEntity
            .created(new URI("/api/laudos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /laudos/:id} : Updates an existing laudo.
     *
     * @param id the id of the laudo to save.
     * @param laudo the laudo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated laudo,
     * or with status {@code 400 (Bad Request)} if the laudo is not valid,
     * or with status {@code 500 (Internal Server Error)} if the laudo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/laudos/{id}")
    public ResponseEntity<Laudo> updateLaudo(@PathVariable(value = "id", required = false) final Long id, @RequestBody Laudo laudo)
        throws URISyntaxException {
        log.debug("REST request to update Laudo : {}, {}", id, laudo);
        if (laudo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, laudo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!laudoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Laudo result = laudoRepository.save(laudo);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, laudo.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /laudos/:id} : Partial updates given fields of an existing laudo, field will ignore if it is null
     *
     * @param id the id of the laudo to save.
     * @param laudo the laudo to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated laudo,
     * or with status {@code 400 (Bad Request)} if the laudo is not valid,
     * or with status {@code 404 (Not Found)} if the laudo is not found,
     * or with status {@code 500 (Internal Server Error)} if the laudo couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/laudos/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Laudo> partialUpdateLaudo(@PathVariable(value = "id", required = false) final Long id, @RequestBody Laudo laudo)
        throws URISyntaxException {
        log.debug("REST request to partial update Laudo partially : {}, {}", id, laudo);
        if (laudo.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, laudo.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!laudoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Laudo> result = laudoRepository
            .findById(laudo.getId())
            .map(
                existingLaudo -> {
                    if (laudo.getParecerMedico() != null) {
                        existingLaudo.setParecerMedico(laudo.getParecerMedico());
                    }
                    if (laudo.getEncaminhamento() != null) {
                        existingLaudo.setEncaminhamento(laudo.getEncaminhamento());
                    }

                    return existingLaudo;
                }
            )
            .map(laudoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, laudo.getId().toString())
        );
    }

    /**
     * {@code GET  /laudos} : get all the laudos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of laudos in body.
     */
    @GetMapping("/laudos")
    public List<Laudo> getAllLaudos() {
        log.debug("REST request to get all Laudos");
        return laudoRepository.findAll();
    }

    /**
     * {@code GET  /laudos/:id} : get the "id" laudo.
     *
     * @param id the id of the laudo to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the laudo, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/laudos/{id}")
    public ResponseEntity<Laudo> getLaudo(@PathVariable Long id) {
        log.debug("REST request to get Laudo : {}", id);
        Optional<Laudo> laudo = laudoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(laudo);
    }

    /**
     * {@code DELETE  /laudos/:id} : delete the "id" laudo.
     *
     * @param id the id of the laudo to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/laudos/{id}")
    public ResponseEntity<Void> deleteLaudo(@PathVariable Long id) {
        log.debug("REST request to delete Laudo : {}", id);
        laudoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
