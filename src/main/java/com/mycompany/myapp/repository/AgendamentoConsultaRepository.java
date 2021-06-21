package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.AgendamentoConsulta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AgendamentoConsulta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AgendamentoConsultaRepository extends JpaRepository<AgendamentoConsulta, Long> {}
