export interface Registro {
    codigoFicha: string;
    apellidosNombres: string;
    unidadOrganica: string;
    codigoPuesto: string;
    nombrePuesto: string;
    foto: string;
    idPid: number;
    estadoEvaluadoRegistro: boolean;
    estadoEvaluadorRegistro: boolean;
    veredictoRegistro: boolean;
    estadoEvaluadoCumplimiento: boolean;
    estadoEvaluadorCumplimiento: boolean;
    veredictoCumplimiento: boolean;
}

export interface IPIDEvaluatorReport {
    registros: Registro[];
    mensaje: string;
}
