interface Fase {
    inicio: string;
    fin: string;
  }
  
interface PlanDesarrollo {
    establecimiento: Fase;
    monitoreo: Fase;
    evaluacion: Fase;
}
  
export interface IRegisterCalendar {
    anio: number;
    tipo: string;
    periodo: string;
    fechaInicio: string;
    fechaFin: string;
    fases: {
      parametrizacion: Fase;
      conocimiento: Fase;
      autoevaluacion: Fase;
      evaluacion: Fase;
      calibracion: Fase;
      retroalimentacion: Fase;
      planDesarrollo: PlanDesarrollo;
      reporteFinal: Fase;
    };
  }