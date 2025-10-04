interface IEvaluatedFacts {
    registros: {
        trabajador_ficha: string;
        trabajador_nombre: string;
        evaluador_ficha: string;
        evaluador_nombre: string;
        competencia_codigo: string;
        competencia_titulo: string;
        competencia_descripcion: string;
        comportamiento_codigo: string;
        comportamiento_descripcion: string;
        indicador: number;
        descripcion: string;
        fecha: number;
    }[];
    mensaje: string;
}
