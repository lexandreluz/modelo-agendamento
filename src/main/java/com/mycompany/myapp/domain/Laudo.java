package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Laudo.
 */
@Entity
@Table(name = "laudo")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Laudo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "parecer_medico")
    private String parecerMedico;

    @Lob
    @Column(name = "encaminhamento")
    private String encaminhamento;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Laudo id(Long id) {
        this.id = id;
        return this;
    }

    public String getParecerMedico() {
        return this.parecerMedico;
    }

    public Laudo parecerMedico(String parecerMedico) {
        this.parecerMedico = parecerMedico;
        return this;
    }

    public void setParecerMedico(String parecerMedico) {
        this.parecerMedico = parecerMedico;
    }

    public String getEncaminhamento() {
        return this.encaminhamento;
    }

    public Laudo encaminhamento(String encaminhamento) {
        this.encaminhamento = encaminhamento;
        return this;
    }

    public void setEncaminhamento(String encaminhamento) {
        this.encaminhamento = encaminhamento;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Laudo)) {
            return false;
        }
        return id != null && id.equals(((Laudo) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Laudo{" +
            "id=" + getId() +
            ", parecerMedico='" + getParecerMedico() + "'" +
            ", encaminhamento='" + getEncaminhamento() + "'" +
            "}";
    }
}
