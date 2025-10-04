import { ICompetenciaResultado } from "./ICompetenciaResultado";

export interface IAutoEvaluationResultRegistros {
    idAutoevaluacion: number;
    estado: number;
    fechaInicio: number;
    fechaFin: number;
    grupoEvaluacion: string;
    calendario: string;
    calendario_nombre: string;
    tipo: string;
    competenciasResultado: ICompetenciaResultado[];
    resultado: number;
    fortaleza: string;
    oportunidad: string;
    ficha: string;
    nombre: string;
    unidadOrganica: string;
    cargo: string;
    competenciaFortaleza: string;
    competenciaOportunidad: string;
}
