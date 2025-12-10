import { ICompetencia } from "./ICompetencia";

export interface IRegistros {
  grupoEvaluacionDes: string;
  calendario: {
    vCodigo: string;
    vNombre: string;
  };
  grupoEvaluacion: string;
  tipo: string;
  competencias: ICompetencia[];
  conformidadOtorgada: boolean;
}