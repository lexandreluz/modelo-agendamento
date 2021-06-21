import * as dayjs from 'dayjs';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { IMedico } from 'app/entities/medico/medico.model';
import { Convenio } from 'app/entities/enumerations/convenio.model';
import { TipoAgendamento } from 'app/entities/enumerations/tipo-agendamento.model';
import { Procedimento } from 'app/entities/enumerations/procedimento.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface IAgendamentoConsulta {
  id?: number;
  idAgendamento?: number;
  convenio?: Convenio | null;
  tipoAgendamento?: TipoAgendamento | null;
  procedimento?: Procedimento | null;
  dataHora?: dayjs.Dayjs | null;
  statusAgendamento?: Status | null;
  usuario?: IUsuario | null;
  medico?: IMedico | null;
}

export class AgendamentoConsulta implements IAgendamentoConsulta {
  constructor(
    public id?: number,
    public idAgendamento?: number,
    public convenio?: Convenio | null,
    public tipoAgendamento?: TipoAgendamento | null,
    public procedimento?: Procedimento | null,
    public dataHora?: dayjs.Dayjs | null,
    public statusAgendamento?: Status | null,
    public usuario?: IUsuario | null,
    public medico?: IMedico | null
  ) {}
}

export function getAgendamentoConsultaIdentifier(agendamentoConsulta: IAgendamentoConsulta): number | undefined {
  return agendamentoConsulta.id;
}
