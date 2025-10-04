  export interface Calendario {
    vCodigo: string;
    vNombre: string;
    tipo: string;
  }
    
  export interface ICalendarParametrizationFlags {
    calendario: Calendario;
    reglaCalculo: boolean;
    grupoEvaluacionAsignacion: boolean;
    evaluacionAsignacion90: boolean;
    evaluacionAsignacion180: boolean;
  }
  