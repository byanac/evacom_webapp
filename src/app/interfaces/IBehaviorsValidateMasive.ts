export interface Competencia {
    codigo: string;
    titulo: string;
  }
  
  export interface Nivel {
    codigo: string;
    nombre: string;
  }
  
  export interface Item {
    codigo: string;
    descripcion: string;
    competencia: Competencia;
    nivel: Nivel;
    mensajesError: string;
  }
  
  export interface Datos {
    listadoCorrectos: Item[];
    listadoIncorrectos: Item[];
  }
  
  export interface IBehaviorsValidateMasive {
    datos: Datos;
    mensaje: string;
  }
  