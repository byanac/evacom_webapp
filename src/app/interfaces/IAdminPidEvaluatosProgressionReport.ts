export interface Registro {
    codigoFicha: string;
    apellidosNombres: string;
    unidadOrganica: string;
    codigoPuesto: string;
    nombrePuesto: string;
    foto: string;
    estadoEvaluadoRegistro: boolean;
    estadoEvaluadorRegistro: boolean;
    veredictoRegistro: boolean;
    estadoEvaluadoCumplimiento: boolean;
    estadoEvaluadorCumplimiento: boolean;
    veredictoCumplimiento: boolean;
    evaluados_total: number;
    evaluados_pendientes_registro: number;
    evaluados_terminados_registro: number;
    evaluados_pendientes_cumplimiento: number;
    evaluados_terminados_cumplimiento: number;
}

export interface IAdminPidEvaluatorsProgressionReport {
    registros: Registro[];
    mensaje: string;
}
