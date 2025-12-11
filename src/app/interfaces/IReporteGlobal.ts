export interface IReporteGlobal {
    calendarioCodigo: string,
    calendarioTipo: string,
    registros: registroEvaluados[]
}

export interface registroEvaluados {
    evaluadorFicha: string,
    evaluadorPuesto: string,
    evaluadoFicha: string,
    evaluadoPuesto: string
  }