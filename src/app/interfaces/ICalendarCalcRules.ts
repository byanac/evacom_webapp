export interface Calendario {
    vCodigo: string;
  }
  
  export interface ICalendarCalcRules {
    calendario: Calendario;
    porcentajeEvaluadorJefe: number;
    porcentajeEvaluadoresSubordinados: number;
    cantidadEvaluadoresSubordinados: number;
  }
  