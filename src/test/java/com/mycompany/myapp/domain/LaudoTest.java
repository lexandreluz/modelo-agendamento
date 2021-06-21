package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LaudoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Laudo.class);
        Laudo laudo1 = new Laudo();
        laudo1.setId(1L);
        Laudo laudo2 = new Laudo();
        laudo2.setId(laudo1.getId());
        assertThat(laudo1).isEqualTo(laudo2);
        laudo2.setId(2L);
        assertThat(laudo1).isNotEqualTo(laudo2);
        laudo1.setId(null);
        assertThat(laudo1).isNotEqualTo(laudo2);
    }
}
