package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AgendamentoConsultaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AgendamentoConsulta.class);
        AgendamentoConsulta agendamentoConsulta1 = new AgendamentoConsulta();
        agendamentoConsulta1.setId(1L);
        AgendamentoConsulta agendamentoConsulta2 = new AgendamentoConsulta();
        agendamentoConsulta2.setId(agendamentoConsulta1.getId());
        assertThat(agendamentoConsulta1).isEqualTo(agendamentoConsulta2);
        agendamentoConsulta2.setId(2L);
        assertThat(agendamentoConsulta1).isNotEqualTo(agendamentoConsulta2);
        agendamentoConsulta1.setId(null);
        assertThat(agendamentoConsulta1).isNotEqualTo(agendamentoConsulta2);
    }
}
