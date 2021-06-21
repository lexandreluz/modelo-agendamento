package com.mycompany.myapp.domain;

import com.mycompany.myapp.domain.enumeration.Convenio;
import com.mycompany.myapp.domain.enumeration.Procedimento;
import com.mycompany.myapp.domain.enumeration.Status;
import com.mycompany.myapp.domain.enumeration.TipoAgendamento;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AgendamentoConsulta.
 */
@Entity
@Table(name = "agendamento_consulta")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AgendamentoConsulta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "id_agendamento", nullable = false)
    private Integer idAgendamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "convenio")
    private Convenio convenio;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_agendamento")
    private TipoAgendamento tipoAgendamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "procedimento")
    private Procedimento procedimento;

    @Column(name = "data_hora")
    private ZonedDateTime dataHora;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_agendamento")
    private Status statusAgendamento;

    @ManyToOne
    private Usuario usuario;

    @ManyToOne
    private Medico medico;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AgendamentoConsulta id(Long id) {
        this.id = id;
        return this;
    }

    public Integer getIdAgendamento() {
        return this.idAgendamento;
    }

    public AgendamentoConsulta idAgendamento(Integer idAgendamento) {
        this.idAgendamento = idAgendamento;
        return this;
    }

    public void setIdAgendamento(Integer idAgendamento) {
        this.idAgendamento = idAgendamento;
    }

    public Convenio getConvenio() {
        return this.convenio;
    }

    public AgendamentoConsulta convenio(Convenio convenio) {
        this.convenio = convenio;
        return this;
    }

    public void setConvenio(Convenio convenio) {
        this.convenio = convenio;
    }

    public TipoAgendamento getTipoAgendamento() {
        return this.tipoAgendamento;
    }

    public AgendamentoConsulta tipoAgendamento(TipoAgendamento tipoAgendamento) {
        this.tipoAgendamento = tipoAgendamento;
        return this;
    }

    public void setTipoAgendamento(TipoAgendamento tipoAgendamento) {
        this.tipoAgendamento = tipoAgendamento;
    }

    public Procedimento getProcedimento() {
        return this.procedimento;
    }

    public AgendamentoConsulta procedimento(Procedimento procedimento) {
        this.procedimento = procedimento;
        return this;
    }

    public void setProcedimento(Procedimento procedimento) {
        this.procedimento = procedimento;
    }

    public ZonedDateTime getDataHora() {
        return this.dataHora;
    }

    public AgendamentoConsulta dataHora(ZonedDateTime dataHora) {
        this.dataHora = dataHora;
        return this;
    }

    public void setDataHora(ZonedDateTime dataHora) {
        this.dataHora = dataHora;
    }

    public Status getStatusAgendamento() {
        return this.statusAgendamento;
    }

    public AgendamentoConsulta statusAgendamento(Status statusAgendamento) {
        this.statusAgendamento = statusAgendamento;
        return this;
    }

    public void setStatusAgendamento(Status statusAgendamento) {
        this.statusAgendamento = statusAgendamento;
    }

    public Usuario getUsuario() {
        return this.usuario;
    }

    public AgendamentoConsulta usuario(Usuario usuario) {
        this.setUsuario(usuario);
        return this;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Medico getMedico() {
        return this.medico;
    }

    public AgendamentoConsulta medico(Medico medico) {
        this.setMedico(medico);
        return this;
    }

    public void setMedico(Medico medico) {
        this.medico = medico;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AgendamentoConsulta)) {
            return false;
        }
        return id != null && id.equals(((AgendamentoConsulta) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AgendamentoConsulta{" +
            "id=" + getId() +
            ", idAgendamento=" + getIdAgendamento() +
            ", convenio='" + getConvenio() + "'" +
            ", tipoAgendamento='" + getTipoAgendamento() + "'" +
            ", procedimento='" + getProcedimento() + "'" +
            ", dataHora='" + getDataHora() + "'" +
            ", statusAgendamento='" + getStatusAgendamento() + "'" +
            "}";
    }
}
