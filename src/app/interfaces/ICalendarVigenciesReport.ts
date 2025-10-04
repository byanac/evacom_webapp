interface Registro {
    vCodigo: string;
    vNombre: string;
    vigente: boolean;
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
    dPidMonIni: string;
    dPidMonFin: string;
    dPidEvalIni: string;
    dPidEvalFin: string;
    dReporIni: string;
    dReporFin: string;
    tipo: string;
}

export interface ICalendarVigenciesReport {
    registros: Registro[];
    mensaje: string;
}
