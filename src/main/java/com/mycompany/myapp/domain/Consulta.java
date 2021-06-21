package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.Especialicacao;
import com.mycompany.myapp.domain.enumeration.Procedimento;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Consulta.
 */
@Entity
@Table(name = "consulta")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Consulta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "procedimento")
    private Procedimento procedimento;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_consulta")
    private Especialicacao tipoConsulta;

    @ManyToOne
    private Medico medico;

    @ManyToOne
    private Laudo laudo;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Consulta id(Long id) {
        this.id = id;
        return this;
    }

    public Procedimento getProcedimento() {
        return this.procedimento;
    }

    public Consulta procedimento(Procedimento procedimento) {
        this.procedimento = procedimento;
        return this;
    }

    public void setProcedimento(Procedimento procedimento) {
        this.procedimento = procedimento;
    }

    public Especialicacao getTipoConsulta() {
        return this.tipoConsulta;
    }

    public Consulta tipoConsulta(Especialicacao tipoConsulta) {
        this.tipoConsulta = tipoConsulta;
        return this;
    }

    public void setTipoConsulta(Especialicacao tipoConsulta) {
        this.tipoConsulta = tipoConsulta;
    }

    public Medico getMedico() {
        return this.medico;
    }

    public Consulta medico(Medico medico) {
        this.setMedico(medico);
        return this;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    public Laudo getLaudo() {
        return this.laudo;
    }

    public Consulta laudo(Laudo laudo) {
        this.setLaudo(laudo);
        return this;
    }

    public void setLaudo(Laudo laudo) {
        this.laudo = laudo;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consulta)) {
            return false;
        }
        return id != null && id.equals(((Consulta) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consulta{" +
            "id=" + getId() +
            ", procedimento='" + getProcedimento() + "'" +
            ", tipoConsulta='" + getTipoConsulta() + "'" +
            "}";
    }
}
