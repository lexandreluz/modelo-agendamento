package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.AgendamentoConsulta;
import com.mycompany.myapp.domain.enumeration.Convenio;
import com.mycompany.myapp.domain.enumeration.Procedimento;
import com.mycompany.myapp.domain.enumeration.Status;
import com.mycompany.myapp.domain.enumeration.TipoAgendamento;
import com.mycompany.myapp.repository.AgendamentoConsultaRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link AgendamentoConsultaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AgendamentoConsultaResourceIT {

    private static final Integer DEFAULT_ID_AGENDAMENTO = 1;
    private static final Integer UPDATED_ID_AGENDAMENTO = 2;

    private static final Convenio DEFAULT_CONVENIO = Convenio.BANCARIO;
    private static final Convenio UPDATED_CONVENIO = Convenio.FUNERARIA;

    private static final TipoAgendamento DEFAULT_TIPO_AGENDAMENTO = TipoAgendamento.EMERGENCIA;
    private static final TipoAgendamento UPDATED_TIPO_AGENDAMENTO = TipoAgendamento.NOVA_CONSULTA;

    private static final Procedimento DEFAULT_PROCEDIMENTO = Procedimento.CONSULTA;
    private static final Procedimento UPDATED_PROCEDIMENTO = Procedimento.EMFERMAGEM;

    private static final ZonedDateTime DEFAULT_DATA_HORA = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATA_HORA = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final Status DEFAULT_STATUS_AGENDAMENTO = Status.CONCLUIDO;
    private static final Status UPDATED_STATUS_AGENDAMENTO = Status.AGENDADO;

    private static final String ENTITY_API_URL = "/api/agendamento-consultas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AgendamentoConsultaRepository agendamentoConsultaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAgendamentoConsultaMockMvc;

    private AgendamentoConsulta agendamentoConsulta;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AgendamentoConsulta createEntity(EntityManager em) {
        AgendamentoConsulta agendamentoConsulta = new AgendamentoConsulta()
            .idAgendamento(DEFAULT_ID_AGENDAMENTO)
            .convenio(DEFAULT_CONVENIO)
            .tipoAgendamento(DEFAULT_TIPO_AGENDAMENTO)
            .procedimento(DEFAULT_PROCEDIMENTO)
            .dataHora(DEFAULT_DATA_HORA)
            .statusAgendamento(DEFAULT_STATUS_AGENDAMENTO);
        return agendamentoConsulta;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AgendamentoConsulta createUpdatedEntity(EntityManager em) {
        AgendamentoConsulta agendamentoConsulta = new AgendamentoConsulta()
            .idAgendamento(UPDATED_ID_AGENDAMENTO)
            .convenio(UPDATED_CONVENIO)
            .tipoAgendamento(UPDATED_TIPO_AGENDAMENTO)
            .procedimento(UPDATED_PROCEDIMENTO)
            .dataHora(UPDATED_DATA_HORA)
            .statusAgendamento(UPDATED_STATUS_AGENDAMENTO);
        return agendamentoConsulta;
    }

    @BeforeEach
    public void initTest() {
        agendamentoConsulta = createEntity(em);
    }

    @Test
    @Transactional
    void createAgendamentoConsulta() throws Exception {
        int databaseSizeBeforeCreate = agendamentoConsultaRepository.findAll().size();
        // Create the AgendamentoConsulta
        restAgendamentoConsultaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agendamentoConsulta))
            )
            .andExpect(status().isCreated());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeCreate + 1);
        AgendamentoConsulta testAgendamentoConsulta = agendamentoConsultaList.get(agendamentoConsultaList.size() - 1);
        assertThat(testAgendamentoConsulta.getIdAgendamento()).isEqualTo(DEFAULT_ID_AGENDAMENTO);
        assertThat(testAgendamentoConsulta.getConvenio()).isEqualTo(DEFAULT_CONVENIO);
        assertThat(testAgendamentoConsulta.getTipoAgendamento()).isEqualTo(DEFAULT_TIPO_AGENDAMENTO);
        assertThat(testAgendamentoConsulta.getProcedimento()).isEqualTo(DEFAULT_PROCEDIMENTO);
        assertThat(testAgendamentoConsulta.getDataHora()).isEqualTo(DEFAULT_DATA_HORA);
        assertThat(testAgendamentoConsulta.getStatusAgendamento()).isEqualTo(DEFAULT_STATUS_AGENDAMENTO);
    }

    @Test
    @Transactional
    void createAgendamentoConsultaWithExistingId() throws Exception {
        // Create the AgendamentoConsulta with an existing ID
        agendamentoConsulta.setId(1L);

        int databaseSizeBeforeCreate = agendamentoConsultaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAgendamentoConsultaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agendamentoConsulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkIdAgendamentoIsRequired() throws Exception {
        int databaseSizeBeforeTest = agendamentoConsultaRepository.findAll().size();
        // set the field null
        agendamentoConsulta.setIdAgendamento(null);

        // Create the AgendamentoConsulta, which fails.

        restAgendamentoConsultaMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agendamentoConsulta))
            )
            .andExpect(status().isBadRequest());

        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAgendamentoConsultas() throws Exception {
        // Initialize the database
        agendamentoConsultaRepository.saveAndFlush(agendamentoConsulta);

        // Get all the agendamentoConsultaList
        restAgendamentoConsultaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(agendamentoConsulta.getId().intValue())))
            .andExpect(jsonPath("$.[*].idAgendamento").value(hasItem(DEFAULT_ID_AGENDAMENTO)))
            .andExpect(jsonPath("$.[*].convenio").value(hasItem(DEFAULT_CONVENIO.toString())))
            .andExpect(jsonPath("$.[*].tipoAgendamento").value(hasItem(DEFAULT_TIPO_AGENDAMENTO.toString())))
            .andExpect(jsonPath("$.[*].procedimento").value(hasItem(DEFAULT_PROCEDIMENTO.toString())))
            .andExpect(jsonPath("$.[*].dataHora").value(hasItem(sameInstant(DEFAULT_DATA_HORA))))
            .andExpect(jsonPath("$.[*].statusAgendamento").value(hasItem(DEFAULT_STATUS_AGENDAMENTO.toString())));
    }

    @Test
    @Transactional
    void getAgendamentoConsulta() throws Exception {
        // Initialize the database
        agendamentoConsultaRepository.saveAndFlush(agendamentoConsulta);

        // Get the agendamentoConsulta
        restAgendamentoConsultaMockMvc
            .perform(get(ENTITY_API_URL_ID, agendamentoConsulta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(agendamentoConsulta.getId().intValue()))
            .andExpect(jsonPath("$.idAgendamento").value(DEFAULT_ID_AGENDAMENTO))
            .andExpect(jsonPath("$.convenio").value(DEFAULT_CONVENIO.toString()))
            .andExpect(jsonPath("$.tipoAgendamento").value(DEFAULT_TIPO_AGENDAMENTO.toString()))
            .andExpect(jsonPath("$.procedimento").value(DEFAULT_PROCEDIMENTO.toString()))
            .andExpect(jsonPath("$.dataHora").value(sameInstant(DEFAULT_DATA_HORA)))
            .andExpect(jsonPath("$.statusAgendamento").value(DEFAULT_STATUS_AGENDAMENTO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAgendamentoConsulta() throws Exception {
        // Get the agendamentoConsulta
        restAgendamentoConsultaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAgendamentoConsulta() throws Exception {
        // Initialize the database
        agendamentoConsultaRepository.saveAndFlush(agendamentoConsulta);

        int databaseSizeBeforeUpdate = agendamentoConsultaRepository.findAll().size();

        // Update the agendamentoConsulta
        AgendamentoConsulta updatedAgendamentoConsulta = agendamentoConsultaRepository.findById(agendamentoConsulta.getId()).get();
        // Disconnect from session so that the updates on updatedAgendamentoConsulta are not directly saved in db
        em.detach(updatedAgendamentoConsulta);
        updatedAgendamentoConsulta
            .idAgendamento(UPDATED_ID_AGENDAMENTO)
            .convenio(UPDATED_CONVENIO)
            .tipoAgendamento(UPDATED_TIPO_AGENDAMENTO)
            .procedimento(UPDATED_PROCEDIMENTO)
            .dataHora(UPDATED_DATA_HORA)
            .statusAgendamento(UPDATED_STATUS_AGENDAMENTO);

        restAgendamentoConsultaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAgendamentoConsulta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAgendamentoConsulta))
            )
            .andExpect(status().isOk());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeUpdate);
        AgendamentoConsulta testAgendamentoConsulta = agendamentoConsultaList.get(agendamentoConsultaList.size() - 1);
        assertThat(testAgendamentoConsulta.getIdAgendamento()).isEqualTo(UPDATED_ID_AGENDAMENTO);
        assertThat(testAgendamentoConsulta.getConvenio()).isEqualTo(UPDATED_CONVENIO);
        assertThat(testAgendamentoConsulta.getTipoAgendamento()).isEqualTo(UPDATED_TIPO_AGENDAMENTO);
        assertThat(testAgendamentoConsulta.getProcedimento()).isEqualTo(UPDATED_PROCEDIMENTO);
        assertThat(testAgendamentoConsulta.getDataHora()).isEqualTo(UPDATED_DATA_HORA);
        assertThat(testAgendamentoConsulta.getStatusAgendamento()).isEqualTo(UPDATED_STATUS_AGENDAMENTO);
    }

    @Test
    @Transactional
    void putNonExistingAgendamentoConsulta() throws Exception {
        int databaseSizeBeforeUpdate = agendamentoConsultaRepository.findAll().size();
        agendamentoConsulta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgendamentoConsultaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, agendamentoConsulta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agendamentoConsulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAgendamentoConsulta() throws Exception {
        int databaseSizeBeforeUpdate = agendamentoConsultaRepository.findAll().size();
        agendamentoConsulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgendamentoConsultaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agendamentoConsulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAgendamentoConsulta() throws Exception {
        int databaseSizeBeforeUpdate = agendamentoConsultaRepository.findAll().size();
        agendamentoConsulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgendamentoConsultaMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agendamentoConsulta))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAgendamentoConsultaWithPatch() throws Exception {
        // Initialize the database
        agendamentoConsultaRepository.saveAndFlush(agendamentoConsulta);

        int databaseSizeBeforeUpdate = agendamentoConsultaRepository.findAll().size();

        // Update the agendamentoConsulta using partial update
        AgendamentoConsulta partialUpdatedAgendamentoConsulta = new AgendamentoConsulta();
        partialUpdatedAgendamentoConsulta.setId(agendamentoConsulta.getId());

        partialUpdatedAgendamentoConsulta
            .convenio(UPDATED_CONVENIO)
            .tipoAgendamento(UPDATED_TIPO_AGENDAMENTO)
            .procedimento(UPDATED_PROCEDIMENTO)
            .dataHora(UPDATED_DATA_HORA)
            .statusAgendamento(UPDATED_STATUS_AGENDAMENTO);

        restAgendamentoConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgendamentoConsulta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgendamentoConsulta))
            )
            .andExpect(status().isOk());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeUpdate);
        AgendamentoConsulta testAgendamentoConsulta = agendamentoConsultaList.get(agendamentoConsultaList.size() - 1);
        assertThat(testAgendamentoConsulta.getIdAgendamento()).isEqualTo(DEFAULT_ID_AGENDAMENTO);
        assertThat(testAgendamentoConsulta.getConvenio()).isEqualTo(UPDATED_CONVENIO);
        assertThat(testAgendamentoConsulta.getTipoAgendamento()).isEqualTo(UPDATED_TIPO_AGENDAMENTO);
        assertThat(testAgendamentoConsulta.getProcedimento()).isEqualTo(UPDATED_PROCEDIMENTO);
        assertThat(testAgendamentoConsulta.getDataHora()).isEqualTo(UPDATED_DATA_HORA);
        assertThat(testAgendamentoConsulta.getStatusAgendamento()).isEqualTo(UPDATED_STATUS_AGENDAMENTO);
    }

    @Test
    @Transactional
    void fullUpdateAgendamentoConsultaWithPatch() throws Exception {
        // Initialize the database
        agendamentoConsultaRepository.saveAndFlush(agendamentoConsulta);

        int databaseSizeBeforeUpdate = agendamentoConsultaRepository.findAll().size();

        // Update the agendamentoConsulta using partial update
        AgendamentoConsulta partialUpdatedAgendamentoConsulta = new AgendamentoConsulta();
        partialUpdatedAgendamentoConsulta.setId(agendamentoConsulta.getId());

        partialUpdatedAgendamentoConsulta
            .idAgendamento(UPDATED_ID_AGENDAMENTO)
            .convenio(UPDATED_CONVENIO)
            .tipoAgendamento(UPDATED_TIPO_AGENDAMENTO)
            .procedimento(UPDATED_PROCEDIMENTO)
            .dataHora(UPDATED_DATA_HORA)
            .statusAgendamento(UPDATED_STATUS_AGENDAMENTO);

        restAgendamentoConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgendamentoConsulta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgendamentoConsulta))
            )
            .andExpect(status().isOk());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeUpdate);
        AgendamentoConsulta testAgendamentoConsulta = agendamentoConsultaList.get(agendamentoConsultaList.size() - 1);
        assertThat(testAgendamentoConsulta.getIdAgendamento()).isEqualTo(UPDATED_ID_AGENDAMENTO);
        assertThat(testAgendamentoConsulta.getConvenio()).isEqualTo(UPDATED_CONVENIO);
        assertThat(testAgendamentoConsulta.getTipoAgendamento()).isEqualTo(UPDATED_TIPO_AGENDAMENTO);
        assertThat(testAgendamentoConsulta.getProcedimento()).isEqualTo(UPDATED_PROCEDIMENTO);
        assertThat(testAgendamentoConsulta.getDataHora()).isEqualTo(UPDATED_DATA_HORA);
        assertThat(testAgendamentoConsulta.getStatusAgendamento()).isEqualTo(UPDATED_STATUS_AGENDAMENTO);
    }

    @Test
    @Transactional
    void patchNonExistingAgendamentoConsulta() throws Exception {
        int databaseSizeBeforeUpdate = agendamentoConsultaRepository.findAll().size();
        agendamentoConsulta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgendamentoConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, agendamentoConsulta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agendamentoConsulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAgendamentoConsulta() throws Exception {
        int databaseSizeBeforeUpdate = agendamentoConsultaRepository.findAll().size();
        agendamentoConsulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgendamentoConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agendamentoConsulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAgendamentoConsulta() throws Exception {
        int databaseSizeBeforeUpdate = agendamentoConsultaRepository.findAll().size();
        agendamentoConsulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgendamentoConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agendamentoConsulta))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AgendamentoConsulta in the database
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAgendamentoConsulta() throws Exception {
        // Initialize the database
        agendamentoConsultaRepository.saveAndFlush(agendamentoConsulta);

        int databaseSizeBeforeDelete = agendamentoConsultaRepository.findAll().size();

        // Delete the agendamentoConsulta
        restAgendamentoConsultaMockMvc
            .perform(delete(ENTITY_API_URL_ID, agendamentoConsulta.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AgendamentoConsulta> agendamentoConsultaList = agendamentoConsultaRepository.findAll();
        assertThat(agendamentoConsultaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
