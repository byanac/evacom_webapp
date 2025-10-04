export interface Periodicidad {
    codigo: number;
    grupo: string;
    valor: string;
    descripcion: string;
    estado: number;
  }
  
  export interface Registro {
    vCodigo: string;
    vNombre: string;
    tipo: string;
    periodo: string;
    vigente: boolean;
    periodicidad: Periodicidad;
    dPeriodoIni: string;
    dPeriodoFin: string;
    dParamIni: string;
    dParamFin: string;
    dConoIni: string;
    dConocFin: string;
    dHechosIni: string;
    dHechosFin: string;
    dAutoIni: string;
    dAutoFin: string;
    dEvalIni: string;
    dEvalFin: string;
    dCalibIni: string;
    dCalibFin: string;
    dRetroIni: string;
    dRetroFin: string;
    dPidEstIni: string;
    dPidEstFin: string;
    dPidEvalIni: string;
    dPidEvalFin: string;
    dReporIni: string;
    dReporFin: string;
  }
  
  export interface ICalendarReport {
    registros: Registro[];
    mensaje: string;
  }
  