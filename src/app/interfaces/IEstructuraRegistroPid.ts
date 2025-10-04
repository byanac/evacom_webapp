export interface Competencia {
    codigo: string;
    titulo: string;
  }
  
  export interface Detalle {
    idPidDetalle: number;
    orden: number;
    competencia: Competencia;
    objetivoDesarrollo: string;
    iniciativaAcciones: string;
    codigosIndicadores: number[];
    codigosEntregables: number[];
    fechaInicioIniciativa: string;
    fechaFinIniciativa: string;   
    comentario: string;
  }
  
  export interface Evaluador {
    codigoFicha: string;
  }
  
  export interface Evaluado {
    codigoFicha: string;
  }
  
  export interface IEstructuraRegistroPid {
    idPid: number;
    evaluador: Evaluador;
    evaluado: Evaluado;
    codCalendario: string;
    detalles: Detalle[];
  }
  