 export interface GrupoEvaluacion {
    codigo: string;
  }
  
  export interface Calendario {
    vCodigo: string;
  }
  
  export interface Trabajador {
    codigoPuesto: string;
    ficha:string;
  }
  
  export interface Admin {
    codigoFicha: string;
  }
  
  export interface IRegisterAsignationEvaluationGroups {
    idGrupoEvaluacionAsignacion?: string;
    grupoEvaluacion: GrupoEvaluacion;
    calendario: Calendario;
    trabajador: Trabajador;
    admin: Admin;
    estado?: number;
  }
  