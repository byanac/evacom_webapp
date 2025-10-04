export interface IKnowledgeReportResponse {
    registros: KnowledgeReportData[];
    mensaje: string;
}

export interface KnowledgeReportData {
    foto:string;
    codigoFicha: string;
    apellidosNombres: string;
    unidadOrganica: string;
    codigoPuesto: string;
    nombrePuesto: string;
    estadoConfirmacion: boolean;
}
