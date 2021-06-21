import { IMedico } from 'app/entities/medico/medico.model';
import { ILaudo } from 'app/entities/laudo/laudo.model';
import { Procedimento } from 'app/entities/enumerations/procedimento.model';
import { Especialicacao } from 'app/entities/enumerations/especialicacao.model';

export interface IConsulta {
  id?: number;
  procedimento?: Procedimento | null;
  tipoConsulta?: Especialicacao | null;
  medico?: IMedico | null;
  laudo?: ILaudo | null;
}

export class Consulta implements IConsulta {
  constructor(
    public id?: number,
    public procedimento?: Procedimento | null,
    public tipoConsulta?: Especialicacao | null,
    public medico?: IMedico | null,
    public laudo?: ILaudo | null
  ) {}
}

export function getConsultaIdentifier(consulta: IConsulta): number | undefined {
  return consulta.id;
}
