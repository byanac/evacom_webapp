export interface Competencia {
  codigo: string;
  titulo: string;
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

export interface IBehavior {
  codigo: string;
  descripcion: string;
  estado: number;
  competencia: Competencia;
  nivel: Nivel;
  admin: Admin;
  fecModificacion: string;
}
