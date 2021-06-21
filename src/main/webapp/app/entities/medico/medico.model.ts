import { Especialicacao } from 'app/entities/enumerations/especialicacao.model';

export interface IMedico {
  id?: number;
  crm?: string;
  nome?: string | null;
  telefone?: string | null;
  especialidade?: Especialicacao | null;
}

export class Medico implements IMedico {
  constructor(
    public id?: number,
    public crm?: string,
    public nome?: string | null,
    public telefone?: string | null,
    public especialidade?: Especialicacao | null
  ) {}
}

export function getMedicoIdentifier(medico: IMedico): number | undefined {
  return medico.id;
}
