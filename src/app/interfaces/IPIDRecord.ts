export interface Competencia {
    codigo: string;
    titulo: string;
    estado: number;
}

export interface Detalle {
    idPidDetalle: number;
    orden: number;
    competencia: Competencia;
    objetivoDesarrollo: string;
    iniciativaAcciones: string;
    codigosIndicadores: any;
    codigosEntregables: any;
    fechaInicioIniciativa: string;
    fechaFinIniciativa: string;
    nombreArchivo: string;
    rutaArchivo: string;
}

export interface Evaluador {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
    correo: string;
}

export interface Evaluado {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
    correo: string;
    equipo_codigo: string;
    equipo_nombre: string;
    gerencia_codigo: string;
    gerencia_nombre: string;
}

export interface Registro {
    idPid: number;
    evaluador: Evaluador;
    evaluado: Evaluado;
    codCalendario: string;
    tipoCalendario: string;
    fecModificacion: string;
    fecModificacionr: string;
    estadoRegistroEvaluado: boolean;
    estadoRegistroEvaluador: boolean;
    veredictoRegistro: boolean;
    fecCumplimientoEvaluado: string;
    fecCumplimientoEvaluador: string;
    estadoCumplimientoEvaluado: boolean;
    estadoCumplimientoEvaluador: boolean;
    veredictoCumplimiento: boolean;
    comentarioRegistro: string;
    comentarioCumplimiento: string;
    detalles: Detalle[];
}

export interface IPIDRecord {
    registros: Registro;
    mensaje: string;
}
