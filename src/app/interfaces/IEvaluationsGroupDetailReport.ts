export interface GrupoEvaluacion {
    codigo: string;
    descripcion: string;
  }
  
  export interface Competencia {
    codigo: string;
    descripcion: string;
    titulo:string
  }
  
  export interface Nivel {
    codigo: string;
    nombre: string;
  }
  
  export interface Admin {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
  }
  
  export interface IEvaluationsGroupDetailReport {
    idGrupoEvaluacionDetalle: number;
    grupoEvaluacion: GrupoEvaluacion;
    competencia: Competencia;
    nivel: Nivel;
    estado: number;
    admin: Admin;
    fecModificacion: string;
  }
  