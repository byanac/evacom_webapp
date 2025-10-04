interface IEvaluatedAddFactsReport  {
    registros: {
        codigoFicha: string;
        apellidosNombres: string;
        unidadOrganica: string;
        codigoPuesto: string;
        nombrePuesto: string;
        foto: string;
    }[];
    mensaje: string;
}