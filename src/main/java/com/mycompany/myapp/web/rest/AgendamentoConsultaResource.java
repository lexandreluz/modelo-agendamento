package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.AgendamentoConsulta;
import com.mycompany.myapp.repository.AgendamentoConsultaRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.AgendamentoConsulta}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AgendamentoConsultaResource {

    private final Logger log = LoggerFactory.getLogger(AgendamentoConsultaResource.class);

    private static final String ENTITY_NAME = "agendamentoConsulta";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AgendamentoConsultaRepository agendamentoConsultaRepository;

    public AgendamentoConsultaResource(AgendamentoConsultaRepository agendamentoConsultaRepository) {
        this.agendamentoConsultaRepository = agendamentoConsultaRepository;
    }

    /**
     * {@code POST  /agendamento-consultas} : Create a new agendamentoConsulta.
     *
     * @param agendamentoConsulta the agendamentoConsulta to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new agendamentoConsulta, or with status {@code 400 (Bad Request)} if the agendamentoConsulta has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/agendamento-consultas")
    public ResponseEntity<AgendamentoConsulta> createAgendamentoConsulta(@Valid @RequestBody AgendamentoConsulta agendamentoConsulta)
        throws URISyntaxException {
        log.debug("REST request to save AgendamentoConsulta : {}", agendamentoConsulta);
        if (agendamentoConsulta.getId() != null) {
            throw new BadRequestAlertException("A new agendamentoConsulta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AgendamentoConsulta result = agendamentoConsultaRepository.save(agendamentoConsulta);
        return ResponseEntity
            .created(new URI("/api/agendamento-consultas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /agendamento-consultas/:id} : Updates an existing agendamentoConsulta.
     *
     * @param id the id of the agendamentoConsulta to save.
     * @param agendamentoConsulta the agendamentoConsulta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agendamentoConsulta,
     * or with status {@code 400 (Bad Request)} if the agendamentoConsulta is not valid,
     * or with status {@code 500 (Internal Server Error)} if the agendamentoConsulta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/agendamento-consultas/{id}")
    public ResponseEntity<AgendamentoConsulta> updateAgendamentoConsulta(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AgendamentoConsulta agendamentoConsulta
    ) throws URISyntaxException {
        log.debug("REST request to update AgendamentoConsulta : {}, {}", id, agendamentoConsulta);
        if (agendamentoConsulta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agendamentoConsulta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agendamentoConsultaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AgendamentoConsulta result = agendamentoConsultaRepository.save(agendamentoConsulta);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agendamentoConsulta.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /agendamento-consultas/:id} : Partial updates given fields of an existing agendamentoConsulta, field will ignore if it is null
     *
     * @param id the id of the agendamentoConsulta to save.
     * @param agendamentoConsulta the agendamentoConsulta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agendamentoConsulta,
     * or with status {@code 400 (Bad Request)} if the agendamentoConsulta is not valid,
     * or with status {@code 404 (Not Found)} if the agendamentoConsulta is not found,
     * or with status {@code 500 (Internal Server Error)} if the agendamentoConsulta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/agendamento-consultas/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<AgendamentoConsulta> partialUpdateAgendamentoConsulta(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AgendamentoConsulta agendamentoConsulta
    ) throws URISyntaxException {
        log.debug("REST request to partial update AgendamentoConsulta partially : {}, {}", id, agendamentoConsulta);
        if (agendamentoConsulta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agendamentoConsulta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agendamentoConsultaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AgendamentoConsulta> result = agendamentoConsultaRepository
            .findById(agendamentoConsulta.getId())
            .map(
                existingAgendamentoConsulta -> {
                    if (agendamentoConsulta.getIdAgendamento() != null) {
                        existingAgendamentoConsulta.setIdAgendamento(agendamentoConsulta.getIdAgendamento());
                    }
                    if (agendamentoConsulta.getConvenio() != null) {
                        existingAgendamentoConsulta.setConvenio(agendamentoConsulta.getConvenio());
                    }
                    if (agendamentoConsulta.getTipoAgendamento() != null) {
                        existingAgendamentoConsulta.setTipoAgendamento(agendamentoConsulta.getTipoAgendamento());
                    }
                    if (agendamentoConsulta.getProcedimento() != null) {
                        existingAgendamentoConsulta.setProcedimento(agendamentoConsulta.getProcedimento());
                    }
                    if (agendamentoConsulta.getDataHora() != null) {
                        existingAgendamentoConsulta.setDataHora(agendamentoConsulta.getDataHora());
                    }
                    if (agendamentoConsulta.getStatusAgendamento() != null) {
                        existingAgendamentoConsulta.setStatusAgendamento(agendamentoConsulta.getStatusAgendamento());
                    }

                    return existingAgendamentoConsulta;
                }
            )
            .map(agendamentoConsultaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agendamentoConsulta.getId().toString())
        );
    }

    /**
     * {@code GET  /agendamento-consultas} : get all the agendamentoConsultas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of agendamentoConsultas in body.
     */
    @GetMapping("/agendamento-consultas")
    public List<AgendamentoConsulta> getAllAgendamentoConsultas() {
        log.debug("REST request to get all AgendamentoConsultas");
        return agendamentoConsultaRepository.findAll();
    }

    /**
     * {@code GET  /agendamento-consultas/:id} : get the "id" agendamentoConsulta.
     *
     * @param id the id of the agendamentoConsulta to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the agendamentoConsulta, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/agendamento-consultas/{id}")
    public ResponseEntity<AgendamentoConsulta> getAgendamentoConsulta(@PathVariable Long id) {
        log.debug("REST request to get AgendamentoConsulta : {}", id);
        Optional<AgendamentoConsulta> agendamentoConsulta = agendamentoConsultaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(agendamentoConsulta);
    }

    /**
     * {@code DELETE  /agendamento-consultas/:id} : delete the "id" agendamentoConsulta.
     *
     * @param id the id of the agendamentoConsulta to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/agendamento-consultas/{id}")
    public ResponseEntity<Void> deleteAgendamentoConsulta(@PathVariable Long id) {
        log.debug("REST request to delete AgendamentoConsulta : {}", id);
        agendamentoConsultaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
