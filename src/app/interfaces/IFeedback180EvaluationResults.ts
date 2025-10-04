export interface Competencia {
    codigo: string;
    titulo: string;
    descripcion: string;
    promedio: number | null;
    promedioAuto: number | null;
    promedioSubalternos: number | null;
    promedioFinal: number | null;
}

export interface Cualitativa {
    nivel: number;
    fortaleza: string;
    oportunidad: string;
    competencia_codigo_fortaleza: string;
    competencia_nombre_fortaleza: string;
    competencia_codigo_oportunidad: string;
    competencia_nombre_oportunidad: string;
}

export interface Evaluador {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
}

export interface Evaluado {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
    equipo_codigo: string;
    equipo_nombre: string;
    gerencia_codigo: string;
    gerencia_nombre: string;
    grupo_eval_codigo: string;
    grupo_eval_nombre: string;
    grupo_ocupacional: string;
}

export interface IFeedback180EvaluationResults {
    evaluado: Evaluado;
    evaluador: Evaluador;
    competencia: Competencia[];
    cualitativa: Cualitativa[];
    promedioJefe: number;
    promedioSubalternos: number;
    promedioFinal: number;
    promedioAutoevaluacion: number;
}
