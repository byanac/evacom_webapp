

export interface GrupoEvaluacion {
    codigo: string;
    descripcion: string;
  }
  
  export interface Calendario {
    vCodigo: string;
    vNombre: string;
    tipo: string;
  }
  
  export interface Trabajador {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
     unidadOrganica: string;
  }
  
  export interface Admin {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
  }
  
  export interface IAsignationEvaluationGroupsReport {
    idGrupoEvaluacionAsignacion: number;
    grupoEvaluacion: GrupoEvaluacion;
    calendario: Calendario;
    trabajador: Trabajador;
    estado: number;
    admin: Admin;
    fecModificacion: string;
  }