export interface Admin {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
  }
  
  export interface ILevel {
    codigo: string;
    nombre: string;
    estado: number;
    admin: Admin;
    fecModificacion: string;
  }
  