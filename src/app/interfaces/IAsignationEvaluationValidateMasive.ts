export interface GrupoEvaluacion {
    codigo: string;
    descripcion: string;
  }
  
  export interface Calendario {
    vCodigo: string;
    vNombre: string;
  }
  
  export interface Trabajador {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
  }
  
  export interface ItemEvaluacion {
    grupoEvaluacion: GrupoEvaluacion;
    calendario: Calendario;
    trabajador: Trabajador;
    mensajesError: string;
  }
  
  export interface Datos {
    listadoCorrectos: ItemEvaluacion[];
    listadoIncorrectos: ItemEvaluacion[];
  }
  
  export interface IAsignationEvaluationValidateMasive {
    datos: Datos;
    mensaje: string;
  }
  