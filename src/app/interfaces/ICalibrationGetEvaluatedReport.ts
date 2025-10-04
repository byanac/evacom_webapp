export interface Evaluador {
  codigoFicha: string;
  apellidosNombres: string;
  codigoPuesto: string;
  nombrePuesto: string;
}

export interface Evaluado extends Evaluador {
  codigoPuesto: string;
  nombrePuesto: string;
  foto: string;
  gerencia_codigo: string;
  unidadOrganica: string;
}

export interface Admin{
  apellidosNombres: string
}

export interface Registro {
  evaluador: Evaluador;
  evaluado: Evaluado;
  admin: Admin;
  estadoCalibracion: boolean;
  fechaRegistro: number;
  fechaLimite: number;
  codCalendario: string;
  idCalibracion: number
}

export interface ICalibrationGetEvaluatedReport {
  registros: Registro[];
  mensaje: string;
}
