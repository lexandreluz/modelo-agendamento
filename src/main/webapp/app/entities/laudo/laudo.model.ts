export interface ILaudo {
  id?: number;
  parecerMedico?: string | null;
  encaminhamento?: string | null;
}

export class Laudo implements ILaudo {
  constructor(public id?: number, public parecerMedico?: string | null, public encaminhamento?: string | null) {}
}

export function getLaudoIdentifier(laudo: ILaudo): number | undefined {
  return laudo.id;
}
