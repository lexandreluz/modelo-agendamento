import * as dayjs from 'dayjs';
import { Sexo } from 'app/entities/enumerations/sexo.model';

export interface IUsuario {
  id?: number;
  cpf?: string;
  nome?: string | null;
  dataNascimento?: dayjs.Dayjs | null;
  rg?: number | null;
  sexo?: Sexo | null;
  telefone?: string | null;
  email?: string | null;
}

export class Usuario implements IUsuario {
  constructor(
    public id?: number,
    public cpf?: string,
    public nome?: string | null,
    public dataNascimento?: dayjs.Dayjs | null,
    public rg?: number | null,
    public sexo?: Sexo | null,
    public telefone?: string | null,
    public email?: string | null
  ) {}
}

export function getUsuarioIdentifier(usuario: IUsuario): number | undefined {
  return usuario.id;
}
