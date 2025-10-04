export interface Evaluador {
    codigoPuesto: string;
    tipoEvaluador: number;
  }
  
  export interface Evaluado {
    codigoPuesto: string;
  }
  
  export interface Calendario {
    vCodigo: string;
  }
  
  export interface Admin {
    codigoFicha: string;
  }
  
  export interface IRegisterEvaluatorsAndEvaluated {
    idEvaluacionAsignacion?: number;
    evaluador: Evaluador;
    evaluado: Evaluado;
    calendario: Calendario;
    admin: Admin;
    estado?: number;
  }
  