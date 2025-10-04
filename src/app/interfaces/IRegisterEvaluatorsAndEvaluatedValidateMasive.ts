export interface Evaluador {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
    tipoEvaluador: number;
  }
  
  export interface Evaluado {
    codigoFicha: string;
    apellidosNombres: string;
    codigoPuesto: string;
    nombrePuesto: string;
  }
  
  export interface Calendario {
    vCodigo: string;
    vNombre: string;
  }
  
  export interface Registro {
    evaluador: Evaluador;
    evaluado: Evaluado;
    calendario: Calendario;
    mensajesError: string;
  }
  
  export interface Datos {
    listadoCorrectos: Registro[];
    listadoIncorrectos: Registro[];
  }
  
  export interface IRegisterEvaluatorsAndEvaluatedValidateMasive {
    datos: Datos;
    mensaje: string;
  }
  