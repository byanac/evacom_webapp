export interface Registro {
    codigoFicha: string;
    apellidosNombres: string;
    foto: string;
    estadoEvaluacion: boolean;
  }
  
  export interface ICalibrationFindEvaluatedByFicha {
    registros: Registro;
    mensaje: string;
  }
  