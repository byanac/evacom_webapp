export interface Grupo {
    codigo: string;
    descripcion: string;
  }
  
  export interface Admin {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
  }
  
  export interface ICompetency {
    codigo: string;
    titulo: string;
    descripcion: string;
    estado: number;
    grupo: Grupo;
    admin: Admin;
    fecModificacion: string;
  }