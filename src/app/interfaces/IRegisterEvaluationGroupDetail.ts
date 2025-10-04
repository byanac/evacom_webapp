export interface GrupoEvaluacion {
    codigo: string;
  }
  
  export interface Competencia {
    codigo: string;
  }
  
  export interface Nivel {
    codigo: string;
  }
  
  export interface Admin {
    codigoFicha: string;
  }
  
  export interface IRegisterEvaluationGroupDetail {
    idGrupoEvaluacionDetalle?: number;
    grupoEvaluacion: GrupoEvaluacion;
    competencia: Competencia;
    nivel: Nivel;
    admin: Admin;
    estado?: number;
  }
  