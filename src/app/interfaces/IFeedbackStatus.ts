export interface Registro {
    codCalendario: string;
    estadoEvaluacion: boolean;
    estadoEvaluador: boolean;
    estadoEvaluado: boolean;
    fichaEvaluado: string;
    fichaEvaluador: string;
    fechaEvaluado: number;
    fechaEvaluador: number;
    comentarioEvaluado: string;
    comentarioEvaluador: string;
}

export interface IFeedbackStatus {
    registros: Registro;
    mensaje: string;
}
