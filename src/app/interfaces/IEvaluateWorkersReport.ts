interface IEvaluateWorkersReport  {
    codigoFicha: string;
    apellidosNombres: string;
    unidadOrganica: string;
    codigoPuesto: string;
    nombrePuesto: string;
    foto: string;
    tipoEvaluador: number;
    estadoEvaluacion: boolean;
    estadoCalibracion: boolean;
    estadoFecLimiteCalibracion: boolean;
    fechaLimiteCalibracion?: string;
}