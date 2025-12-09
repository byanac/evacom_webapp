export interface Evaluador {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
    tipoEvaluador: number;
    equipo_codigo: string;
  }
  
  export interface Evaluado {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
  }
  
  export interface Calendario {
    vCodigo: string;
    vNombre: string;
    tipo: string;
  }
  
  export interface Admin {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
  }
  
  export interface IEvaluatorandEvaluatedsReport {
    idEvaluacionAsignacion: number;
    evaluador: Evaluador;
    evaluado: Evaluado;
    calendario: Calendario;
    estado: number;
    admin: Admin;
    fecModificacion: string;
  }
  