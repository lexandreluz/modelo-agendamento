import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'medico',
        data: { pageTitle: 'agendamentoMedicoApp.medico.home.title' },
        loadChildren: () => import('./medico/medico.module').then(m => m.MedicoModule),
      },
      {
        path: 'usuario',
        data: { pageTitle: 'agendamentoMedicoApp.usuario.home.title' },
        loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioModule),
      },
      {
        path: 'agendamento-consulta',
        data: { pageTitle: 'agendamentoMedicoApp.agendamentoConsulta.home.title' },
        loadChildren: () => import('./agendamento-consulta/agendamento-consulta.module').then(m => m.AgendamentoConsultaModule),
      },
      {
        path: 'consulta',
        data: { pageTitle: 'agendamentoMedicoApp.consulta.home.title' },
        loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaModule),
      },
      {
        path: 'laudo',
        data: { pageTitle: 'agendamentoMedicoApp.laudo.home.title' },
        loadChildren: () => import('./laudo/laudo.module').then(m => m.LaudoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
