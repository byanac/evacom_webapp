import { ICompetencia } from "./ICompetencia";

export interface IRegistros {
  calendario: {
    vCodigo: string;
    vNombre: string;
  };
  grupoEvaluacion: string;
  tipo: string;
  competencias: ICompetencia[];
  conformidadOtorgada: boolean;
}