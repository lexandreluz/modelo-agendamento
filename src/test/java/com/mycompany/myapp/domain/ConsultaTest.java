package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConsultaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Consulta.class);
        Consulta consulta1 = new Consulta();
        consulta1.setId(1L);
        Consulta consulta2 = new Consulta();
        consulta2.setId(consulta1.getId());
        assertThat(consulta1).isEqualTo(consulta2);
        consulta2.setId(2L);
        assertThat(consulta1).isNotEqualTo(consulta2);
        consulta1.setId(null);
        assertThat(consulta1).isNotEqualTo(consulta2);
    }
}
