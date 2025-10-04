export interface Grupo {
    codigo: string;
    descripcion: string;
  }
  
  export interface Item {
    codigo: string;
    titulo: string;
    descripcion: string;
    grupo: Grupo;
    mensajesError: string;
  }
  
  export interface Datos {
    listadoCorrectos: Item[];
    listadoIncorrectos: Item[];
  }
  
  export interface ICompetencyValidateMasive {
    datos: Datos;
    mensaje: string;
  }
  