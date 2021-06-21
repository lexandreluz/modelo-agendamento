package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Laudo;
import com.mycompany.myapp.repository.LaudoRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link LaudoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LaudoResourceIT {

    private static final String DEFAULT_PARECER_MEDICO = "AAAAAAAAAA";
    private static final String UPDATED_PARECER_MEDICO = "BBBBBBBBBB";

    private static final String DEFAULT_ENCAMINHAMENTO = "AAAAAAAAAA";
    private static final String UPDATED_ENCAMINHAMENTO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/laudos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LaudoRepository laudoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLaudoMockMvc;

    private Laudo laudo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Laudo createEntity(EntityManager em) {
        Laudo laudo = new Laudo().parecerMedico(DEFAULT_PARECER_MEDICO).encaminhamento(DEFAULT_ENCAMINHAMENTO);
        return laudo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Laudo createUpdatedEntity(EntityManager em) {
        Laudo laudo = new Laudo().parecerMedico(UPDATED_PARECER_MEDICO).encaminhamento(UPDATED_ENCAMINHAMENTO);
        return laudo;
    }

    @BeforeEach
    public void initTest() {
        laudo = createEntity(em);
    }

    @Test
    @Transactional
    void createLaudo() throws Exception {
        int databaseSizeBeforeCreate = laudoRepository.findAll().size();
        // Create the Laudo
        restLaudoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laudo)))
            .andExpect(status().isCreated());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeCreate + 1);
        Laudo testLaudo = laudoList.get(laudoList.size() - 1);
        assertThat(testLaudo.getParecerMedico()).isEqualTo(DEFAULT_PARECER_MEDICO);
        assertThat(testLaudo.getEncaminhamento()).isEqualTo(DEFAULT_ENCAMINHAMENTO);
    }

    @Test
    @Transactional
    void createLaudoWithExistingId() throws Exception {
        // Create the Laudo with an existing ID
        laudo.setId(1L);

        int databaseSizeBeforeCreate = laudoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLaudoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laudo)))
            .andExpect(status().isBadRequest());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLaudos() throws Exception {
        // Initialize the database
        laudoRepository.saveAndFlush(laudo);

        // Get all the laudoList
        restLaudoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(laudo.getId().intValue())))
            .andExpect(jsonPath("$.[*].parecerMedico").value(hasItem(DEFAULT_PARECER_MEDICO.toString())))
            .andExpect(jsonPath("$.[*].encaminhamento").value(hasItem(DEFAULT_ENCAMINHAMENTO.toString())));
    }

    @Test
    @Transactional
    void getLaudo() throws Exception {
        // Initialize the database
        laudoRepository.saveAndFlush(laudo);

        // Get the laudo
        restLaudoMockMvc
            .perform(get(ENTITY_API_URL_ID, laudo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(laudo.getId().intValue()))
            .andExpect(jsonPath("$.parecerMedico").value(DEFAULT_PARECER_MEDICO.toString()))
            .andExpect(jsonPath("$.encaminhamento").value(DEFAULT_ENCAMINHAMENTO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLaudo() throws Exception {
        // Get the laudo
        restLaudoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLaudo() throws Exception {
        // Initialize the database
        laudoRepository.saveAndFlush(laudo);

        int databaseSizeBeforeUpdate = laudoRepository.findAll().size();

        // Update the laudo
        Laudo updatedLaudo = laudoRepository.findById(laudo.getId()).get();
        // Disconnect from session so that the updates on updatedLaudo are not directly saved in db
        em.detach(updatedLaudo);
        updatedLaudo.parecerMedico(UPDATED_PARECER_MEDICO).encaminhamento(UPDATED_ENCAMINHAMENTO);

        restLaudoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLaudo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLaudo))
            )
            .andExpect(status().isOk());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeUpdate);
        Laudo testLaudo = laudoList.get(laudoList.size() - 1);
        assertThat(testLaudo.getParecerMedico()).isEqualTo(UPDATED_PARECER_MEDICO);
        assertThat(testLaudo.getEncaminhamento()).isEqualTo(UPDATED_ENCAMINHAMENTO);
    }

    @Test
    @Transactional
    void putNonExistingLaudo() throws Exception {
        int databaseSizeBeforeUpdate = laudoRepository.findAll().size();
        laudo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLaudoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, laudo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(laudo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLaudo() throws Exception {
        int databaseSizeBeforeUpdate = laudoRepository.findAll().size();
        laudo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaudoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(laudo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLaudo() throws Exception {
        int databaseSizeBeforeUpdate = laudoRepository.findAll().size();
        laudo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaudoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(laudo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLaudoWithPatch() throws Exception {
        // Initialize the database
        laudoRepository.saveAndFlush(laudo);

        int databaseSizeBeforeUpdate = laudoRepository.findAll().size();

        // Update the laudo using partial update
        Laudo partialUpdatedLaudo = new Laudo();
        partialUpdatedLaudo.setId(laudo.getId());

        partialUpdatedLaudo.encaminhamento(UPDATED_ENCAMINHAMENTO);

        restLaudoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaudo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaudo))
            )
            .andExpect(status().isOk());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeUpdate);
        Laudo testLaudo = laudoList.get(laudoList.size() - 1);
        assertThat(testLaudo.getParecerMedico()).isEqualTo(DEFAULT_PARECER_MEDICO);
        assertThat(testLaudo.getEncaminhamento()).isEqualTo(UPDATED_ENCAMINHAMENTO);
    }

    @Test
    @Transactional
    void fullUpdateLaudoWithPatch() throws Exception {
        // Initialize the database
        laudoRepository.saveAndFlush(laudo);

        int databaseSizeBeforeUpdate = laudoRepository.findAll().size();

        // Update the laudo using partial update
        Laudo partialUpdatedLaudo = new Laudo();
        partialUpdatedLaudo.setId(laudo.getId());

        partialUpdatedLaudo.parecerMedico(UPDATED_PARECER_MEDICO).encaminhamento(UPDATED_ENCAMINHAMENTO);

        restLaudoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLaudo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLaudo))
            )
            .andExpect(status().isOk());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeUpdate);
        Laudo testLaudo = laudoList.get(laudoList.size() - 1);
        assertThat(testLaudo.getParecerMedico()).isEqualTo(UPDATED_PARECER_MEDICO);
        assertThat(testLaudo.getEncaminhamento()).isEqualTo(UPDATED_ENCAMINHAMENTO);
    }

    @Test
    @Transactional
    void patchNonExistingLaudo() throws Exception {
        int databaseSizeBeforeUpdate = laudoRepository.findAll().size();
        laudo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLaudoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, laudo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(laudo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLaudo() throws Exception {
        int databaseSizeBeforeUpdate = laudoRepository.findAll().size();
        laudo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaudoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(laudo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLaudo() throws Exception {
        int databaseSizeBeforeUpdate = laudoRepository.findAll().size();
        laudo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLaudoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(laudo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Laudo in the database
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLaudo() throws Exception {
        // Initialize the database
        laudoRepository.saveAndFlush(laudo);

        int databaseSizeBeforeDelete = laudoRepository.findAll().size();

        // Delete the laudo
        restLaudoMockMvc
            .perform(delete(ENTITY_API_URL_ID, laudo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Laudo> laudoList = laudoRepository.findAll();
        assertThat(laudoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
