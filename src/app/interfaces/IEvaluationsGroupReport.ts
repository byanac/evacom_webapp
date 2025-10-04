export interface Admin {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
  }
  
  export interface IEvaluationsGroupReport {
    codigo: string;
    descripcion: string;
    estado: number;
    admin: Admin;
    fecModificacion: string;
  }
  