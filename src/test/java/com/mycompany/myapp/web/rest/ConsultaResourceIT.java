package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Consulta;
import com.mycompany.myapp.domain.enumeration.Especialicacao;
import com.mycompany.myapp.domain.enumeration.Procedimento;
import com.mycompany.myapp.repository.ConsultaRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ConsultaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConsultaResourceIT {

    private static final Procedimento DEFAULT_PROCEDIMENTO = Procedimento.CONSULTA;
    private static final Procedimento UPDATED_PROCEDIMENTO = Procedimento.EMFERMAGEM;

    private static final Especialicacao DEFAULT_TIPO_CONSULTA = Especialicacao.CLINICA_GERAL;
    private static final Especialicacao UPDATED_TIPO_CONSULTA = Especialicacao.EMFERMAGEM;

    private static final String ENTITY_API_URL = "/api/consultas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConsultaMockMvc;

    private Consulta consulta;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consulta createEntity(EntityManager em) {
        Consulta consulta = new Consulta().procedimento(DEFAULT_PROCEDIMENTO).tipoConsulta(DEFAULT_TIPO_CONSULTA);
        return consulta;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consulta createUpdatedEntity(EntityManager em) {
        Consulta consulta = new Consulta().procedimento(UPDATED_PROCEDIMENTO).tipoConsulta(UPDATED_TIPO_CONSULTA);
        return consulta;
    }

    @BeforeEach
    public void initTest() {
        consulta = createEntity(em);
    }

    @Test
    @Transactional
    void createConsulta() throws Exception {
        int databaseSizeBeforeCreate = consultaRepository.findAll().size();
        // Create the Consulta
        restConsultaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consulta)))
            .andExpect(status().isCreated());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeCreate + 1);
        Consulta testConsulta = consultaList.get(consultaList.size() - 1);
        assertThat(testConsulta.getProcedimento()).isEqualTo(DEFAULT_PROCEDIMENTO);
        assertThat(testConsulta.getTipoConsulta()).isEqualTo(DEFAULT_TIPO_CONSULTA);
    }

    @Test
    @Transactional
    void createConsultaWithExistingId() throws Exception {
        // Create the Consulta with an existing ID
        consulta.setId(1L);

        int databaseSizeBeforeCreate = consultaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConsultaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consulta)))
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConsultas() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        // Get all the consultaList
        restConsultaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(consulta.getId().intValue())))
            .andExpect(jsonPath("$.[*].procedimento").value(hasItem(DEFAULT_PROCEDIMENTO.toString())))
            .andExpect(jsonPath("$.[*].tipoConsulta").value(hasItem(DEFAULT_TIPO_CONSULTA.toString())));
    }

    @Test
    @Transactional
    void getConsulta() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        // Get the consulta
        restConsultaMockMvc
            .perform(get(ENTITY_API_URL_ID, consulta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(consulta.getId().intValue()))
            .andExpect(jsonPath("$.procedimento").value(DEFAULT_PROCEDIMENTO.toString()))
            .andExpect(jsonPath("$.tipoConsulta").value(DEFAULT_TIPO_CONSULTA.toString()));
    }

    @Test
    @Transactional
    void getNonExistingConsulta() throws Exception {
        // Get the consulta
        restConsultaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConsulta() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();

        // Update the consulta
        Consulta updatedConsulta = consultaRepository.findById(consulta.getId()).get();
        // Disconnect from session so that the updates on updatedConsulta are not directly saved in db
        em.detach(updatedConsulta);
        updatedConsulta.procedimento(UPDATED_PROCEDIMENTO).tipoConsulta(UPDATED_TIPO_CONSULTA);

        restConsultaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConsulta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConsulta))
            )
            .andExpect(status().isOk());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
        Consulta testConsulta = consultaList.get(consultaList.size() - 1);
        assertThat(testConsulta.getProcedimento()).isEqualTo(UPDATED_PROCEDIMENTO);
        assertThat(testConsulta.getTipoConsulta()).isEqualTo(UPDATED_TIPO_CONSULTA);
    }

    @Test
    @Transactional
    void putNonExistingConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, consulta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consulta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConsultaWithPatch() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();

        // Update the consulta using partial update
        Consulta partialUpdatedConsulta = new Consulta();
        partialUpdatedConsulta.setId(consulta.getId());

        partialUpdatedConsulta.procedimento(UPDATED_PROCEDIMENTO);

        restConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsulta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsulta))
            )
            .andExpect(status().isOk());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
        Consulta testConsulta = consultaList.get(consultaList.size() - 1);
        assertThat(testConsulta.getProcedimento()).isEqualTo(UPDATED_PROCEDIMENTO);
        assertThat(testConsulta.getTipoConsulta()).isEqualTo(DEFAULT_TIPO_CONSULTA);
    }

    @Test
    @Transactional
    void fullUpdateConsultaWithPatch() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();

        // Update the consulta using partial update
        Consulta partialUpdatedConsulta = new Consulta();
        partialUpdatedConsulta.setId(consulta.getId());

        partialUpdatedConsulta.procedimento(UPDATED_PROCEDIMENTO).tipoConsulta(UPDATED_TIPO_CONSULTA);

        restConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsulta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsulta))
            )
            .andExpect(status().isOk());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
        Consulta testConsulta = consultaList.get(consultaList.size() - 1);
        assertThat(testConsulta.getProcedimento()).isEqualTo(UPDATED_PROCEDIMENTO);
        assertThat(testConsulta.getTipoConsulta()).isEqualTo(UPDATED_TIPO_CONSULTA);
    }

    @Test
    @Transactional
    void patchNonExistingConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, consulta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consulta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConsulta() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        int databaseSizeBeforeDelete = consultaRepository.findAll().size();

        // Delete the consulta
        restConsultaMockMvc
            .perform(delete(ENTITY_API_URL_ID, consulta.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
